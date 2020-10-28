<template>
  <div class="component" :class="{active: component.active}">
    <h3>{{ component.name }}</h3>
    power:
    <input
      type="range"
      name="reactor-power"
      min="0"
      max="1"
      step="0.1"
      :value="component.power"
      @input="component.setPower($event.target.value)"
    />
    <!-- <p>{{ component.description }}</p> -->
    <div class="target-container">
      <div>
        Target:
        <span v-if="target">{{ target.name }}</span>
      </div>
      <div class="target-colors" v-if="target">
        <SevenSegmentDisplay :value="+target.c.toFixed(0) || 0" color="cyan" />
        <SevenSegmentDisplay :value="+target.m.toFixed(0) || 0" color="magenta" />
        <SevenSegmentDisplay :value="+target.y.toFixed(0) || 0" color="yellow" />
        <SevenSegmentDisplay :value="+target.k.toFixed(0) || 0" color="black" />
      </div>
      <div class="target-colors" v-else>
        <SevenSegmentDisplay :value="0" color="cyan" />
        <SevenSegmentDisplay :value="0" color="magenta" />
        <SevenSegmentDisplay :value="0" color="yellow" />
        <SevenSegmentDisplay :value="0" color="black" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SevenSegmentDisplay from "@/components/SevenSegmentDisplay.vue";

import ShipComponent from "@/classes/ShipComponent";
import Ship from "@/classes/Ship";
import Asteroid from "@/classes/Asteroid";

export default defineComponent({
  name: "ComponentLaser",
  components: {
    SevenSegmentDisplay
  },
  props: {
    component: {
      type: ShipComponent,
      required: true
    },
    ship: {
      type: Ship,
      required: true
    },
    target: {
      type: Asteroid,
      required: false
    }
  }
});
</script>

<style scoped lang="scss" vars="{}">
.component {
  border: 1px solid rgba($color: #000000, $alpha: 0);
}
.active {
  border: 1px solid rgb(173, 0, 253);
}
.target-container {
  display: flex;

  div {
    flex: 3;
  }
}
.target-colors {
  border-radius: 0.2rem;
  overflow: hidden;
  flex: 5rem;
}
</style>
