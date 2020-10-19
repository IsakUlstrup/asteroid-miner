<template>
  <div class="travel scene">
    <div class="status">
      <h1>Traveling to: {{destination}}</h1>
      <progress min="0" :max="progress.distance" :value="progress.current" />
      <br>
      <player-ship :ship="ship" />
      <ship-controls :ship="ship" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs } from "vue";
import PlayerShip from "@/components/PlayerShip.vue";
import ShipControls from "@/components/ShipControls.vue";

import Ship from "@/classes/Ship";
// import component from '*.vue';
// import Item from "@/classes/Item";

export default defineComponent({
  name: "Travel",
  components: {
    PlayerShip,
    ShipControls
  },
  props: {
    ship:Ship,
    destination:String
  },
  emits: ["arrive", "travel"],
  setup(props, context) {
    const {ship} = toRefs(props);
    const progress = ref({
      distance: 100,
      current: 0
    });
    const speedMultiplier = .01;
    const timing = ref({
      dt: 0,
      last: 0
    });

    function updateProgress(dt:number) {
      let speed = 0;
      if (ship && ship.value) {
        ship.value.enabledEngines.forEach(e => {
          speed += e.use();
        })
      }

      progress.value.current += speed * speedMultiplier * timing.value.dt;
      if (progress.value.current >= progress.value.distance) {
        progress.value.current = progress.value.distance;
        // call for scene change
        context.emit("arrive", props.destination);
      }
      // console.log(`current: ${progress.value.current}, distance: ${progress.value.distance}, dt: ${timing.value.dt}`);
    }

    function loop() {
      if (progress.value.current >= progress.value.distance) return;
      window.requestAnimationFrame(loop);
      const now = performance.now();
      timing.value.dt = now - timing.value.last;

      updateProgress(timing.value.dt);

      timing.value.last = now;
    }

    onMounted( () => {
      progress.value.current = 0;
      const now = performance.now();
      timing.value.dt = now - timing.value.last;
      timing.value.last = now;
      // console.log(`current: ${progress.value.current}, distance: ${progress.value.distance}`);
      loop();
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
}
.status {
  background: rgba($color: #fff, $alpha: .3);
  border-radius: 1rem;
  padding: 3rem;
  display: inline-block;
}
</style>
