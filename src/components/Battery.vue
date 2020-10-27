<template>
  <svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com">
    <rect class="progress" :width="current" height="40" />
    <rect width="100" height="40" style="stroke: rgb(0, 0, 0); fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2px;" bx:origin="0.555556 0.5"/>
    <polyline style="" points="51.435 4 41.823 20.344 49.935 19.576 45.459 34 56.823 14.416 49.851 14.617 51.435 4" bx:origin="0.738378 0.465037"/>
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import ShipComponent from "@/classes/ShipComponent";
import Ship from "@/classes/Ship";

export default defineComponent({
  name: "Battery",
  props: {
    current: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    }
  }
});
</script>

<style scoped lang="scss" vars="{}">
svg {
  width: 4rem;
  height: 4rem;
}
.progress {
  fill: yellow;
}
</style>
