<template>
  <div class="reactor">
    <h1>{{ equipment.name }}</h1>
    Power:
    <input
      type="range"
      name="power"
      min="0"
      max="1"
      step="0.1"
      @input="equipment.setPower(+$event.target.value)"
      :value="equipment.state.powerModifier"
    />
    <br />
    {{ equipment.state.energy.toFixed(0) }} /
    {{ equipment.energyBufferSize }}
    <p>energy use {{ equipment.derivedStats.energyUse }}</p>
    <p>fuel {{ equipment.state.fuel }} / {{ equipment.fuelBufferSize }}</p>
    <p>effect {{ equipment.derivedStats.effect }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Equipment from "../classes/Equipment";

export default defineComponent({
  name: "Reactor",
  props: {
    equipment: {
      type: Equipment,
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
