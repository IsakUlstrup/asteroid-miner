<template>
  <h2>Ship components</h2>
  <ul>
    <li
      class="component"
      v-for="component in ship.components"
      :key="component.name"
    >
      <input
        type="checkbox"
        :id="component.name"
        name="enable-component"
        v-model="component.enabled"
      />
      <label :for="component.name">{{ component.name }}</label>
      <p>{{ component.description }}</p>
      <p>active: {{ component.active }}</p>
      heating: {{ component.heating.toFixed(1) }}
      <br />
      energy use: {{ component.energyUse.toFixed(1) }}
      <br />
      effect: {{ component.effect.toFixed(1) }}
      <br />
      power: {{ component.power }}
      <br />
      <input
        type="range"
        name="component-efficiency"
        min="0"
        max="1"
        step="0.1"
        v-model="component.power"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Ship from "@/classes/Ship";
// import MiningLaser from "@/classes/MiningLaser";

export default defineComponent({
  name: "ShipControls",
  props: {
    ship: {
      type: Ship,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped>
h2 {
  margin-bottom: 2rem;
}
ul {
  list-style: none;
  display: flex;

  li {
    margin-right: 3rem;
  }
}
label {
  margin-left: 1rem;
  font-weight: bold;
}
.component {
  border: 1px solid #262626;
  padding: 2rem;
  border-radius: 0.3rem;
}
</style>
