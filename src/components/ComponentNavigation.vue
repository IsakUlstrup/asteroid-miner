<template>
  <div class="component">
    <strong>{{ component.name }}</strong>
    <p>{{ component.description }}</p>
    <input type="button" value="station" @click="travelTo('station')" />
    <br />
    <input type="button" value="asteroid field" @click="travelTo('asteroidField')" />
    <br />
    engine power:
    <ul>
      <li v-for="engine in ship.engines" :key="engine">
        <input
          type="range"
          name="engine-power"
          min="0"
          max="1"
          step="0.1"
          v-model="engine.power"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";

import ShipComponent from "@/classes/ShipComponent";
import Ship from "@/classes/Ship";

export default defineComponent({
  name: "ComponentNavigation",
  props: {
    component: {
      type: ShipComponent,
      required: true
    },
    ship: {
      type: Ship,
      required: true
    }
  },
  setup(props, context) {
    function travelTo(destination: string) {
      context.emit("travel", destination);
    }
    
    return {
      travelTo
    };
  }
});
</script>

<style scoped lang="scss" vars="{}">
ul {
  list-style: none;
}
.component {
  padding: 1rem;
}
</style>
