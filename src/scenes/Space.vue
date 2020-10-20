<template>
  <div class="space scene" id="space-wrapper">
    <section class="space" ref="space">
      <div class="ship">
        <player-ship :ship="ship" />
        <div class="lasers">
          <laser-beam
            v-if="mining && ship.enabledLasers.length > 0"
            :x2="mousePosition.x"
            :y2="mousePosition.y"
            :thickness="6"
            :color="'cyan'"
          />
        </div>
      </div>

      <div class="encounter">
        <ul v-if="asteroids.length > 0">
          <li
            class="asteriod"
            v-for="asteriod in asteroids"
            :key="asteriod.name"
            @touchstart="miningTarget = asteriod"
            @mouseenter="miningTarget = asteriod"
            @mouseleave="setTarget"
          >
            <h3>{{ asteriod.name }}</h3>
            <p>asteriod</p>
            <p>hp: {{ asteriod.hp.toFixed(0) }}</p>
          </li>
        </ul>
        <ul v-if="loot.length > 0" class="loot">
          <li v-for="item in loot" :key="item.name">
            <input
              type="button"
              :value="'Loot ' + item.name"
              @mousedown="lootItem(item)"
              @touchstart="lootItem(item)"
            />
          </li>
        </ul>
      </div>
    </section>
    <section class="ship-controls">
      <ship-controls :ship="ship" />
      <input type="button" value="travel home" @click="travelHome" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs, watch } from "vue";
import PlayerShip from "@/components/PlayerShip.vue";
import LaserBeam from "@/components/LaserBeam.vue";
import ShipControls from "@/components/ShipControls.vue";

import Ship from "@/classes/Ship";
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
    ship: {
      type: Ship,
      required: true
    },
    destination: String,
    dt: {
      type: Number,
      required: true,
      default: 0
    }
  },
  emits: ["arrive", "travel"],
  setup(props, context) {
    const { dt } = toRefs(props);
    const loot: Item[] = [];
    const asteroids: Asteroid[] = [];
    const space = ref<HTMLDivElement>();
    const miningTarget = ref<Asteroid>();
    const mouseTarget = ref<Element>();
    const mousePosition = ref({
      x: 0,
      y: 0
    });

    const mining = ref<boolean>(false);

    onMounted(() => {
      if (!space.value) return;

      space.value.addEventListener("mousemove", event => {
        mousePosition.value.x = event.clientX;
        mousePosition.value.y = event.clientY;
      });

      space.value.addEventListener('touchstart', event => {
        event.preventDefault();
        const touches = event.changedTouches;
        // console.log(touches[0].pageX, touches[0].pageY);
        mousePosition.value.x = touches[0].pageX;
        mousePosition.value.y = touches[0].pageY;
        if (props.ship && props.ship.enabledLasers.length > 0)
          mining.value = true;
      }, false);

      space.value.addEventListener("touchmove", event => {
        event.preventDefault();
        const touches = event.changedTouches;
        mousePosition.value.x = touches[0].pageX;
        mousePosition.value.y = touches[0].pageY;
      });

      space.value.addEventListener('touchend', () => {
        mining.value = false;
      }, false);

      space.value.addEventListener("mouseleave", () => {
        mining.value = false;
      });

      space.value.addEventListener("mousedown", () => {
        if (props.ship && props.ship.enabledLasers.length > 0)
          mining.value = true;
      });

      space.value.addEventListener("mouseup", () => {
        mining.value = false;
      });
    });

    function touchTest(event:TouchEvent, astreoid:Asteroid) {
      console.log(event, astreoid);
    }

    function travelHome() {
      context.emit("travel", "Station");
    }

    function setTarget(event: MouseEvent) {
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
    function mine(dt: number) {
      if (asteroids.length <= 0) return;
      if (
        props.ship &&
        props.ship.components[0].active &&
        typeof miningTarget.value !== "undefined"
      ) {
        miningTarget.value.hp -= props.ship.enabledLasers[0].power * dt * 0.01;
      }
    }
    function lootItem(item: Item) {
      if (props.ship) props.ship.lootItem(item);
      loot.splice(loot.indexOf(item), 1);
    }

    function update(dt: number) {
      // mouseTarget.value = document.elementFromPoint(mousePosition.value.x, mousePosition.value.y) || undefined;
      // if (mouseTarget.value) console.log(mouseTarget.value.attributes);

      if (
        props.ship &&
        props.ship.enabledLasers.length > 0 &&
        mining.value === true
      ) {
        // activate lasers
        props.ship.activateLasers();
        mine(dt);
      } else {
        if (props.ship) props.ship.deactivateLasers();
      }
      // if (mining.value) mine(timing.value.dt);
      updateAsteriods();
      addAsteroids();
    }
    watch(dt, update);

    // loop();
    return {
      asteroids,
      loot,
      lootItem,
      mining,
      mousePosition,
      space,
      miningTarget,
      setTarget,
      travelHome,
      mouseTarget,
      touchTest
    };
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
    background: rgba($color: #fff, $alpha: 0.9);
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
