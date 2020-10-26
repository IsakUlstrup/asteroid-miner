<template>
  <div class="scene">
    <section class="space" ref="space">
      <AsteroidDisplay
          v-for="asteroid in asteroids"
          :key="asteroid.name"
          @touchstart="touchMine($event, asteroid)"
          @mouseenter="miningTarget = asteroid"
          @mouseleave="setTarget"
          :asteroid="asteroid"
          class="asteroid"
        />

        <!-- <ul v-if="loot.length > 0" class="loot">
          <li v-for="item in loot" :key="item.name">
            <input
              :disabled="!ship.canLoot(item.volume * item.quantity)"
              type="button"
              :value="'Loot ' + item.quantity + ' ' + item.name"
              @mousedown="lootOre(item)"
              @touchstart="lootOre(item)"
            />
          </li>
        </ul> -->
    </section>
    <section class="ship">
      <laser-beam
        v-if="mining && ship.poweredLasers.length > 0"
        :x2="mousePosition.x"
        :y2="mousePosition.y"
        :thickness="6"
        :color="'cyan'"
      />
      <ShipControls :ship="ship" @travel="travelTo" />
      <!-- <input type="button" value="travel home" @click="travelHome" /> -->
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs, watch, reactive } from "vue";
// import PlayerShip from "@/components/PlayerShip.vue";
import LaserBeam from "@/components/LaserBeam.vue";
import ShipControls from "@/components/ShipControls.vue";
import AsteroidDisplay from "@/components/AsteroidDisplay.vue";

import Ship from "@/classes/Ship";
import Asteroid from "@/classes/Asteroid";
import Item from "@/classes/Item";
import Ore from "@/classes/Ore";

export default defineComponent({
  name: "Space",
  components: {
    // PlayerShip,
    LaserBeam,
    ShipControls,
    AsteroidDisplay
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
    const loot: Ore[] = [];
    const asteroids: Asteroid[] = reactive([]);
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

      space.value.addEventListener('touchend', () => {
        mining.value = false;
        miningTarget.value = undefined;
      }, false);

      space.value.addEventListener("mouseleave", () => {
        mining.value = false;
      });

      space.value.addEventListener("mousedown", () => {
        if (props.ship.poweredLasers.length > 0)
          mining.value = true;
      });

      space.value.addEventListener("mouseup", () => {
        mining.value = false;
      });
    });

    function touchMine(event:TouchEvent, astreoid:Asteroid) {
      event.preventDefault();
      const touches = event.changedTouches;
      miningTarget.value = astreoid;

      mousePosition.value.x = touches[0].pageX;
      mousePosition.value.y = touches[0].pageY;
      if (props.ship && props.ship.poweredLasers.length > 0) mining.value = true;
    }

    function travelHome() {
      context.emit("travel", "Station");
    }

    function travelTo(location:string) {
      // console.log("travel:", location);
      context.emit("travel", location);
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
        const amount = parseInt((Math.random() + 1 * 3).toFixed(0));
        for (let index = 0; index < amount; index++) {
          asteroids.push(new Asteroid());
        }
      }
    }
    function updateAsteriods() {
      if (asteroids.length <= 0) return;
      asteroids.forEach(a => {
        if (a.hp <= 0) {
          mining.value = false;
          // console.log(a.dropOre());
          const ores = a.dropOre();
          ores.forEach(o => loot.push(o));
          asteroids.splice(asteroids.indexOf(a), 1);
          // loot.push(new Item("Ore"));
        }
      });
    }
    function mine(dt: number) {
      if (asteroids.length <= 0) return;
      if (
        props.ship.poweredLasers.length > 0 &&
        typeof miningTarget.value !== "undefined"
      ) {
        miningTarget.value.hp -= props.ship.poweredLasers[0].power * dt * 0.01;
      }
    }
    // function lootItem(item: Item) {
    //   if (props.ship) props.ship.lootItem(item);
    //   loot.splice(loot.indexOf(item), 1);
    // }
    function lootOre(ore: Ore) {
      if (props.ship.lootOre(ore)) {
        loot.splice(loot.indexOf(ore), 1);
      }
    }

    function update(dt: number) {
      // mouseTarget.value = document.elementFromPoint(mousePosition.value.x, mousePosition.value.y) || undefined;
      // if (mouseTarget.value) console.log(mouseTarget.value.attributes);

      if (
        props.ship.poweredLasers.length > 0 &&
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
      // addAsteroids();
    }

    addAsteroids();
    watch(dt, update);

    // loop();
    return {
      asteroids,
      loot,
      lootOre,
      mining,
      mousePosition,
      space,
      miningTarget,
      setTarget,
      travelTo,
      mouseTarget,
      touchMine
    };
  }
});
</script>

<style lang="scss" scoped>
.scene {
  background: url("../assets/bg2.jpg");
  // background: black;
  background-size: cover;
  height: 100vh;
  user-select: none;
  display: flex;
  flex-direction: column;
}
.space {
  flex: 1;
  display: flex;
  // padding: 5rem;
  overflow: hidden;
  justify-content: space-evenly;
  align-items: center;
}
.asteroid {
  flex: auto;
  flex-grow: 0;
  padding: 3rem;
  // flex-basis: 100px;
}
.ship {
  flex: 3;
  background: #262626;
  padding: 2rem;
  overflow-y: scroll;
  // border-radius: 1rem 1rem 0 0;
  box-shadow: 0 0 1rem rgba($color: #000000, $alpha: 0.7) inset;
}

/* low res phone portrait */
@media only screen and (max-width: 600px) {
  .scene {
    flex-direction: column;
  }
  .space {
    flex: 2;
  }
  .asteroid {
    max-width: 200px;
  }
}
/* any device landscape */
@media only screen and (orientation: landscape) {
  .scene {
    flex-direction: row-reverse;
  }
  .space {
    flex-direction: column;
    flex: 2;
  }
  .ship {
    flex: 1;
  }
}
/* high res device */
@media only screen and (min-width: 800px) {
  .scene {
    flex-direction: column;
  }
  .space {
    flex: 20;
    flex-direction: row;
  }
  .ship {
    flex: auto;
    padding: 5rem;
  }
}
</style>
