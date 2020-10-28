<template>
  <div class="component" :class="{active: component.active}">
    <div class="header">
      <ScreenGlare />
      <SevenSegmentDisplay class="segment-display" :value="component.power" color="cyan" />
      <span>❄︎</span>
    </div>
    <!-- <strong>{{ component.name }}</strong>
    <p>{{ component.description }}</p> -->
    <div class="controls">
      <input
        type="range"
        name="reactor-power"
        min="0"
        max="1"
        step="0.1"
        :value="component.power"
        @input="component.setPower($event.target.value)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ShipComponent from "@/classes/ShipComponent";
import Ship from "@/classes/Ship";
import SevenSegmentDisplay from "@/components/SevenSegmentDisplay.vue";
import ScreenGlare from "@/components/ScreenGlare.vue";

export default defineComponent({
  name: "ComponentCooler",
  components: {
    SevenSegmentDisplay,
    ScreenGlare
  },
  props: {
    component: {
      type: ShipComponent,
      required: true
    },
    ship: {
      type: Ship,
      required: true
    }
  }
});
</script>

<style scoped lang="scss" vars="{}">
.component {
  // border: 1px solid rgba($color: #000000, $alpha: 0);
  // background: #5f5f5f;
  padding: 0.2rem;

}
.segement-display {
  font-size: 25rem;
}
.header {
  position: relative;
  overflow: hidden;
  background: #262626;
  text-align: center;
  border-radius: 0.6rem 0.6rem 0 0;
  // padding: 1rem;
  // border: 0.2rem solid rgb(36, 36, 36);
  box-shadow: 0 0 0.5rem rgba($color: #000000, $alpha: 0.7) inset;
  color: rgb(255, 255, 255);
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
.header span {
  color: cyan;
  font-size: 2rem;
  margin: 0.3rem;
  text-shadow: 0 0 0.2rem cyan;
}
h2 {
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
}
input {
  width: 100%;
}
// .active {
//   border: 1px solid rgb(173, 0, 253);
// }
.controls {
  padding: 1rem;
}
</style>
