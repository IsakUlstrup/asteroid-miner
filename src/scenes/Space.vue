<template>
  <div class="space scene" id="space-wrapper">
    <section class="space" ref="space">
      <div class="ship">
        <player-ship :dt="timing.dt" :ship="ship" />
        <div class="lasers">
          <laser-beam v-if="mining && ship.enabledLasers.length > 0" :x2="mousePosition.x" :y2="mousePosition.y" :thickness="2" :color="'cyan'" />
        </div>
      </div>
    
      <div class="encounter">
        <ul v-if="asteroids.length > 0">
          <li class="asteriod" v-for="asteriod in asteroids" :key="asteriod.name" @mouseenter="miningTarget = asteriod" @mouseleave="setTarget">
            <h3>{{ asteriod.name }}</h3>
            <p>asteriod</p>
            <p>hp: {{ asteriod.hp.toFixed(0) }}</p>
          </li>
        </ul>
        <ul v-if="loot.length > 0" class="loot">
          <li v-for="item in loot" :key="item.name"><input type="button" :value=" 'Loot ' + item.name" @mousedown="lootItem(item)"></li>
        </ul>
      </div>
    </section>
    <section class="ship-controls">
      <ship-controls :ship="ship" />
      <input type="button" value="travel home" @click="travelHome">
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
import PlayerShip from "@/components/PlayerShip.vue";
import LaserBeam from "@/components/LaserBeam.vue";
import ShipControls from "@/components/ShipControls.vue";

import Ship from "@/classes/Ship";
import MiningLaser from "@/classes/MiningLaser";
import Cooler from "@/classes/Cooler";
import Reactor from "@/classes/Reactor";
import Asteroid from "@/classes/Asteroid";
import Item from "@/classes/Item";

export default defineComponent({
  name: "Space",
  components: {
    PlayerShip,
    LaserBeam,
    ShipControls
  },
  props: {
    ship:Ship,
    destination:String
  },
  emits: ["arrive", "travel"],
  setup(props, context) {
    const { ship } = toRefs(props);
    const timing = ref({
      dt:0,
      last:0
    });

    const loot:Item[] = [];

    // const ship = reactive(new Ship("SS awesome"));
    const asteroids:Asteroid[] = [];
    const space = ref<HTMLDivElement>();
    const miningTarget = ref<Asteroid>();

    // ship.addReactor(new Reactor());
    // ship.addCooler(new Cooler());
    // ship.addMiningLaser(new MiningLaser());

    const mousePosition = ref({
      x: 0,
      y: 0
    });

    const mining = ref<boolean>(false);

    onMounted(() => {
      if (! space.value) return;

      space.value.addEventListener("mousemove", event => {
        mousePosition.value.x = event.clientX;
        mousePosition.value.y = event.clientY;
      });

      space.value.addEventListener("mouseleave", event =>{
        mining.value = false;
      });

      space.value.addEventListener("mousedown", event => {
        if (ship && ship.value && ship.value.enabledLasers.length > 0) mining.value = true;
      });

      space.value.addEventListener("mouseup", event => {
        mining.value = false;
      });
    });

    function travelHome() {
      context.emit("travel", "Station");
    }

    function setTarget(event:MouseEvent) {
      // only disable target if mouse moves to anything but laser beam
      const leaveTo = event.relatedTarget as HTMLDivElement;
      if (leaveTo.classList.contains("laser-beam")) {
        return;
      }
      miningTarget.value = undefined;
    }

    function addAsteroids() {
      if (loot.length > 0) return;
      if (asteroids.length <= 0) {
        asteroids.push(new Asteroid());
      }
    }
    function updateAsteriods() {
      if (asteroids.length <= 0) return;
      asteroids.forEach(a => {
        if (a.hp <= 0) {
          asteroids.splice(asteroids.indexOf(a), 1);
          loot.push(new Item("Ore"));
        }
      });
    }
    function mine(dt:number) {
      if (asteroids.length <= 0) return;
      if (ship && ship.value && ship.value.components[0].active && typeof miningTarget.value !== "undefined") miningTarget.value.hp -= ship.value.enabledLasers[0].power * dt * .01;
    }
    function lootItem(item:Item) {
      if (ship && ship.value) ship.value.lootItem(item);
      loot.splice(loot.indexOf(item), 1);
    }

    function loop() {
      window.requestAnimationFrame(loop);
      const now = performance.now();
      timing.value.dt = now - timing.value.last;

      if (ship && ship.value) ship.value.update(timing.value.dt);
      if (ship && ship.value && ship.value.enabledLasers.length > 0 && mining.value === true) {
        // activate lasers
        ship.value.activateLasers();
        mine(timing.value.dt);
      } else {
        if (ship && ship.value) ship.value.deactivateLasers();
      }
      // if (mining.value) mine(timing.value.dt);
      updateAsteriods();
      addAsteroids();

      timing.value.last = now;
    }

    loop();
    return {
      timing,
      asteroids,
      loot,
      lootItem,
      mining,
      mousePosition,
      space,
      miningTarget,
      setTarget,
      travelHome
    }
  }
});
</script>

<style lang="scss" scoped>
#space-wrapper {
  background: url("../assets/bg2.jpg");
  background-size: cover;
  display: flex;
  flex-direction: column;
  // flex-wrap: wrap;
  width: 100%;
  height: 100vh;
  user-select: none;

  section {
    flex: 100%;
    padding: 5rem;
    // flex-grow: 100%;
  }

  .space {
    display: flex;

    div {
      flex: 1;
    }
  }

  .ship-controls {
    border-top: 1px solid #262626;
    background: rgba($color: #fff, $alpha: .9);
    flex: 20%;
    box-shadow: 0 0 4px black;
  }
  .asteriod {
    background: brown;
    display: inline-block;
    padding: 2rem;
    border-radius: 0.3rem;
  }

  .ship {
    float: left;
  }

  .lasers {
    float: left;
  }

  .loot {
    list-style: none;

    input[type="button"] {
      padding: 2rem;
    }
  }
}
</style>
