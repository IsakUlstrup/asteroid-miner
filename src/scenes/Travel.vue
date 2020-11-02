<template>
  <div class="travel scene">
    <div class="status">
      <h1>Traveling to: {{ destination }}</h1>
      <progress min="0" :max="progress.distance" :value="progress.current" />
      <br />
      <!-- <player-ship :ship="ship" /> -->
      <ship-controls :ship="ship" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref, toRefs } from "vue";
// import PlayerShip from "@/components/PlayerShip.vue";
import ShipControls from "@/components/ShipControls.vue";

import Ship from "@/classes/Ship";
import GameLoop from "@/classes/GameLoop";
// import component from '*.vue';
// import Item from "@/classes/Item";

export default defineComponent({
  name: "Travel",
  components: {
    // PlayerShip,
    ShipControls
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
    const { ship } = toRefs(props);
    const progress = ref({
      distance: 100,
      current: 0
    });
    const speedMultiplier = 0.01;

    function update(dt: number) {
      let speed = 0;
      if (ship && ship.value) {
        ship.value.poweredEngines.forEach(e => {
          e.active = true;
          speed += e.effect;
        });
      }

      progress.value.current += speed * speedMultiplier * dt;
      if (progress.value.current >= progress.value.distance) {
        progress.value.current = progress.value.distance;
        // call for scene change
        ship.value.poweredEngines.forEach(e => {
          e.active = false;
        });
        context.emit("arrive", props.destination);
      }
      // console.log(`current: ${progress.value.current}, distance: ${progress.value.distance}, dt: ${timing.value.dt}`);
    }
    // function update(dt: number) {
    //   updateProgress(dt);
    // }
    // watch(dt, update);
    GameLoop.addListener(update);

    onMounted(() => {
      progress.value.current = 0;
    });
    return {
      progress
    };
  }
});
</script>

<style lang="scss" scoped>
.travel {
  background: url("../assets/bg1.jpg");
  text-align: center;
  height: 100%;
}
.status {
  background: rgba($color: #fff, $alpha: 0.3);
  border-radius: 1rem;
  padding: 3rem;
  display: inline-block;
}
</style>
