<template>
  <div class="component">
    <strong>{{ component.name }}</strong>
    <p>{{ component.description }}</p>
    <input type="button" value="station" @click="travelTo('station')" />
    <br />
    <input type="button" value="asteroid field" @click="travelTo('asteroidField')" />
    <br />
    engine power: {{ power }}
    <br />
    <input
      type="range"
      name="component-efficiency"
      min="0"
      max="1"
      step="0.1"
      v-model="power"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import ShipComponent from "@/classes/ShipComponent";

export default defineComponent({
  name: "NavigationComponent",
  props: {
    component: {
      type: ShipComponent,
      required: true
    },
    shipEnginePower: {
      type: Number,
      default: 0
    }
  },
  setup(props, context) {
    const power = ref(0);

    function travelTo(destination: string) {
      context.emit("travel", destination);
    }

    function enginePower() {
      context.emit("engine-power", power.value);
    }

    watch(power, () => {
      enginePower();
    });
    
    return {
      travelTo,
      enginePower,
      power
    };
  }
});
</script>

<style scoped lang="scss" vars="{}"></style>
