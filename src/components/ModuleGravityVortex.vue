<template>
  <div class="gravity-vortex">
    <h1>{{ module.name }}</h1>
    Power:
    <input
      type="range"
      name="power"
      min="0"
      max="1"
      step="0.1"
      @input="module.setPower(+$event.target.value)"
      :value="module.state.powerModifier"
    />
    <p>
      aoe: {{ module.derivedStats.effect }}<br />
      energy: {{ module.state.energy.toFixed(0) }}/
      {{ module.derivedStats.energyUse }}w
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Module from "@/classes/Module";
import Ship from "@/classes/Ship";

export default defineComponent({
  name: "Laser",
  components: {},
  props: {
    module: {
      type: Module,
      required: true
    },
    ship: {
      type: Ship,
      required: true
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
input[type="range"] {
  width: 100%;
}
</style>
