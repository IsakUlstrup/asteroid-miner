<template>
  <div class="engine">
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
    <p>position: {{ ship.position.toFixed(2) }}</p>
    <p>
      thrust: {{ equipment.derivedStats.effect }}<br />
      energy: {{ equipment.state.energy.toFixed(0) }}/
      {{ equipment.derivedStats.energyUse }}w
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Equipment from "@/classes/Equipment";
import Ship from "@/classes/Ship";

export default defineComponent({
  name: "Laser",
  components: {},
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
