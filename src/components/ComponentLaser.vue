<template>
    <div class="component" :class="{active: component.active}">
      <div class="controls">
        <h3>{{ component.name }}</h3>
        Power:<br />
        <input
          type="range"
          name="reactor-power"
          min="0"
          max="1"
          step="0.1"
          :value="component.power"
          @input="component.setPower($event.target.value)"
        />
        <!-- <br />
        <span v-if="target">Target: {{ target.name }}</span> -->
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
// Font: Lazer 84
// http://sunrise-digital.net/font.html
@font-face {
  font-family: Lazer84;
  src: url("../assets/Lazer84.ttf");
}
.component {
  // border: 1px solid rgba($color: #000000, $alpha: 0);
  // margin: 0.3rem;
  // padding: 0.2rem;
  display: flex;
  // height: 15rem;
  // flex-wrap: wrap;
  // background: linear-gradient(rgb(7, 178, 221), rgb(5, 149, 216));
  border-radius: 0.6rem;
}
h3 {
  text-align: center;
  font-family: Lazer84, sans-serif;
  background: -webkit-linear-gradient(rgb(255, 88, 247), rgb(255, 0, 170));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(2px 2px rgb(0, 225, 255));
  font-size: 1.8rem;
  margin-bottom: 2rem;
}
.controls {
  padding: 1rem;
  flex: 100%;
}
input {
  width: 100%;
}
.target-colors {
  border-radius: 0.6rem;
  overflow: hidden;
  flex: 5rem;
  padding: 1rem;
  background: #262626;
  border: 0.1rem solid #111;
}
</style>
