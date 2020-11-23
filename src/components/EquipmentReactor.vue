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
    <p>
      fuel {{ equipment.state.fuel.toFixed(2) }} /
      {{ equipment.fuelBufferSize }}
    </p>
    <p>output {{ equipment.derivedStats.effect }}w</p>
    <p>ship surplus energy: {{ ship.surplusEnergy.toFixed(2) }}w</p>
  </div>
</template>

<script lang="ts">
import Ship from "@/classes/Ship";
import { defineComponent } from "vue";
import Equipment from "../classes/Equipment";

export default defineComponent({
  name: "Reactor",
  props: {
    equipment: {
      type: Equipment,
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
