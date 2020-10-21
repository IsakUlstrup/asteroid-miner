<template>
  <ul>
    <li
      class="component"
      :class="{active: component.active}"
      v-for="component in ship.components"
      :key="component.name"
    >
      <strong>{{ component.name }}</strong>
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
    <li class="component">
      <strong>navigation</strong>
      <br />
      <input type="button" value="travel home" @click="travelHome" />
      <!-- <br />
      <input type="button" value="next field" @click="travelToNextField" /> -->
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
  },
  emits: ["travel"],
  setup(props, context) {
    function travelHome() {
      context.emit("travel", "Station");
    }

    function travelToNextField() {
      context.emit("travel", "Space");
    }

    return {
      travelHome,
      travelToNextField
    }
  }
});
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  li {
    margin: 1rem;
  }
}
label {
  padding: 1rem;
  font-weight: bold;
}
.component {
  border: 1px solid #262626;
  padding: 1rem;
  border-radius: 0.3rem;
}
.active {
  border: 1px solid green;
  box-shadow: 0 0 4px green;
}

@media only screen and (max-width: 600px) {
  .component {
    font-size: 1rem;

    input[type="range"] {
      display: inline-block;
      width: 50%;
    }
  }
}
</style>
