<template>
  <ComponentWrapper>
    <div class="speed-control">
      <h3>Speed control</h3>
      <p>speed: <input type="button" value="1x" @click="GameLoop.setSpeed(1)"> <input type="button" value="2x" @click="GameLoop.setSpeed(2)"> <input type="button" value="5x" @click="GameLoop.setSpeed(5)"></p>
      pause: <input type="button" :value="paused? 'unpause': 'pause'" @click="togglePause">
      <p>paused: {{ paused }}</p>
      <p>dt: {{ GameLoop.timing.dt.toFixed(1) }}</p>
    </div>
  </ComponentWrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import ShipComponent from "@/classes/ShipComponent";
import ComponentWrapper from "@/components/ComponentWrapper.vue";
// import Ship from "@/classes/Ship";
import GameLoop from "@/classes/GameLoop";

export default defineComponent({
  name: "ComponentDebugSpeedControl",
  components: {
    ComponentWrapper
  },
  setup(props, context) {
    const paused = ref(false);

    function togglePause() {
      paused.value = ! paused.value;
      GameLoop.pause(paused.value);
    }

    return {
      GameLoop,
      paused,
      togglePause
    };
  }
});
</script>

<style scoped lang="scss" vars="{}">
.speed-control {
  padding: 1rem;
}
</style>
