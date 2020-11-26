<template>
  <div class="reactor">
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
      fuel {{ module.state.fuel.toFixed(2) }} /
      {{ module.fuelBufferSize }}
    </p>
    <p>output {{ module.derivedStats.effect }}w</p>
    <p>ship surplus energy: {{ ship.surplusEnergy.toFixed(2) }}w</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Ship from "@/classes/Ship";
import Module from "../classes/Module";

export default defineComponent({
  name: "Reactor",
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

<style scoped lang="scss">
input[type="range"] {
  width: 100%;
}
</style>
