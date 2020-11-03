<template>
  <div class="scene">
    <section class="space">
      <AsteroidDisplay
        v-for="asteroid in asteroids"
        :key="asteroid.name"
        :asteroid="asteroid"
        class="asteroid"
        @toggle-target="setTarget"
        :targeted="miningTarget === asteroid"
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
    <!-- <div class="ship-status">
      <Meter :max="100" :value="+ship.energy.toFixed(0)">Battery</Meter>
      <Meter :max="100" :value="+ship.remainingFuel.toFixed(0)">Fuel</Meter>
      <Meter :max="100" :value="+ship.heat.toFixed(0)">Temp</Meter>
    </div> -->
    <section class="ship">
      <!-- <laser-beam
        v-if="miningTarget && ship.poweredLasers.length > 0"
        :x2="mousePosition.x"
        :y2="mousePosition.y"
        :thickness="6"
        :color="'red'"
      /> -->
      <ShipControls class="ship-controls" :ship="ship" @travel="travelTo" :target="miningTarget" :targetCoordinates="targetCoordinates" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs, watch, reactive } from "vue";
// import PlayerShip from "@/components/PlayerShip.vue";
// import LaserBeam from "@/components/LaserBeam.vue";
import ShipControls from "@/components/ShipControls.vue";
import AsteroidDisplay from "@/components/AsteroidDisplay.vue";
// import Meter from "@/components/Meter.vue";

import Ship from "@/classes/Ship";
import Asteroid from "@/classes/Asteroid";
import Item from "@/classes/Item";
import Ore from "@/classes/Ore";
import GameLoop from "@/classes/GameLoop";

export default defineComponent({
  name: "Space",
  components: {
    // PlayerShip,
    // LaserBeam,
    ShipControls,
    AsteroidDisplay,
    // Meter
  },
  props: {
    ship: {
      type: Ship,
      required: true
    },
    destination: String,
    // dt: {
    //   type: Number,
    //   required: true,
    //   default: 0
    // }
  },
  emits: ["arrive", "travel"],
  setup(props, context) {
    // const { dt } = toRefs(props);
    const loot: Ore[] = [];
    const asteroids: Asteroid[] = reactive([]);
    const miningTarget = ref<Asteroid>();
    const targetCoordinates = ref({
      x: 0,
      y: 0
    });
    // const target = ref({
    //   object: ref<Asteroid>(),
    //   coordinates: {
    //     x: 0,
    //     y: 0
    //   }
    // });
    // // const mouseTarget = ref<Element>();
    // const mousePosition = ref({
    //   x: 0,
    //   y: 0
    // });

    const mining = ref<boolean>(false);

    function setTarget(targetInfo: Record<string, any>) {
      // console.log(targetInfo);
      if (targetInfo.target === miningTarget.value) {
        miningTarget.value = undefined;
        // target.value.object = undefined;
        // mousePosition.value.x = 0;
        targetCoordinates.value.x = 0;
        // mousePosition.value.y = 0;
        targetCoordinates.value.y = 0;
      } else {
        // miningTarget.value = targetInfo.target;
        miningTarget.value = targetInfo.target;
        targetCoordinates.value.x = targetInfo.x;
        targetCoordinates.value.y = targetInfo.y;
      }
    }

    // function touchMine(event:TouchEvent, astreoid:Asteroid) {
    //   event.preventDefault();
    //   const touches = event.changedTouches;
    //   miningTarget.value = astreoid;

    //   mousePosition.value.x = touches[0].pageX;
    //   mousePosition.value.y = touches[0].pageY;
    //   if (props.ship && props.ship.poweredLasers.length > 0) mining.value = true;
    // }

    function travelHome() {
      context.emit("travel", "Station");
    }

    function travelTo(location:string) {
      // console.log("travel:", location);
      context.emit("travel", location);
    }

    // function setTarget(event: MouseEvent) {
    //   // only disable target if mouse moves to anything but laser beam
    //   const leaveTo = event.relatedTarget as HTMLDivElement;
    //   if (leaveTo.classList.contains("laser-beam")) {
    //     return;
    //   }
    //   miningTarget.value = undefined;
    // }

    function addAsteroids() {
      if (loot.length > 0) return;
      if (asteroids.length <= 0) {
        const amount = parseInt((Math.random() * 9).toFixed(0));
        for (let index = 0; index < amount; index++) {
          asteroids.push(new Asteroid());
        }
      }
    }
    function updateAsteriods() {
      if (asteroids.length <= 0) return;
      asteroids.forEach(a => {
        if (a.c <= 0 && a.m <= 0 && a.y <= 0 && a.k <= 0) {
          mining.value = false;
          miningTarget.value = undefined;
          // target.value.object = undefined;
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
        // miningTarget.value.hp -= props.ship.poweredLasers[0].power * dt * 0.01;
        if (miningTarget.value) {
          miningTarget.value.c -= props.ship.poweredLasers[0].power * props.ship.poweredLasers[0].color.c * dt * 0.0001;
          if (miningTarget.value.c < 0) miningTarget.value.c = 0;

          miningTarget.value.m -= props.ship.poweredLasers[0].power * props.ship.poweredLasers[0].color.m * dt * 0.0001;
          if (miningTarget.value.m < 0) miningTarget.value.m = 0;

          miningTarget.value.y -= props.ship.poweredLasers[0].power * props.ship.poweredLasers[0].color.y * dt * 0.0001;
          if (miningTarget.value.y < 0) miningTarget.value.y = 0;

          miningTarget.value.k -= props.ship.poweredLasers[0].power * props.ship.poweredLasers[0].color.k * dt * 0.0001;
          if (miningTarget.value.k < 0) miningTarget.value.k = 0;
        }
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
        props.ship.poweredLasers.length > 0
        && miningTarget.value
      ) {
        // activate lasers
        props.ship.activateLasers();
        mine(dt);
      } else {
        props.ship.deactivateLasers();
      }
      // if (mining.value) mine(timing.value.dt);
      updateAsteriods();
      // addAsteroids();
    }

    addAsteroids();
    // watch(dt, update);
    GameLoop.addListener(update);

    // loop();
    return {
      asteroids,
      loot,
      lootOre,
      mining,
      // mousePosition,
      miningTarget,
      targetCoordinates,
      setTarget,
      travelTo,
      // target
    };
  }
});
</script>

<style lang="scss" scoped>
.scene {
  background: url("../assets/bg.svg") repeat;
  background-size: 5rem;
  height: 100vh;
  user-select: none;
  display: flex;
  flex-direction: column;
}
.space {
  // flex: 1;
  // display: flex;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-template-rows: 33% 33% 33%;
  // padding: 5rem;
  overflow: hidden;
  padding: 3rem;
  justify-content: center;
  align-items: center;
}
.asteroid {
  justify-self: center;
}
.ship {
  flex: 3;
  background: #262626;
  padding: 2rem;
  overflow-y: scroll;
  // border-radius: 1rem 1rem 0 0;
  box-shadow: 0 0 1rem rgba($color: #000000, $alpha: 0.7) inset;
}
.ship-status {
  // color: lightcyan;
  opacity: 0.6;
  // text-shadow: 0 0 0.3rem lightcyan;
  font-weight: lighter;
  text-align: center;
  height: 5rem;
  display: flex;

  .meter {
    margin: 2rem;
  }
}

/* low res phone portrait */
@media only screen and (max-width: 600px) {
  .scene {
    flex-direction: column;
  }
  .space {
    flex: 2;
  }
  .meter {
    height: 1rem;
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
  .ship-status {
    flex-direction: column;
    height: 1rem;
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
  .meter {
    transform: rotate(0deg);
  }
  .ship-status {
    flex-direction: row;
    height: 8rem;
  }
}
</style>
