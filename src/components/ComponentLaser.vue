<template>
    <div class="component" :class="{active: component.active}">
      <LaserBeam v-if="target && targetCoordinates && component.power > 0" :x2="targetCoordinates.x" :y2="targetCoordinates.y" :color="cssColor" />
      <div class="controls">
        <h3>{{ component.name }}</h3>
        <select name="laser-color" v-model="color">
          <option selected="selected" :value="{c: 100, m: 0, y: 0, k: 0}">Cyan</option>
          <option :value="{c: 0, m: 100, y: 0, k: 0}">Magenta</option>
          <option :value="{c: 0, m: 0, y: 100, k: 0}">Yellow</option>
          <option :value="{c: 0, m: 0, y: 0, k: 100}">Black</option>
        </select>
        <br />
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
      <div class="colors">
        <SevenSegmentDisplay :value="component.color.c.toFixed(0)" color="cyan" />
        <SevenSegmentDisplay :value="component.color.m.toFixed(0)" color="magenta" />
        <SevenSegmentDisplay :value="component.color.y.toFixed(0)" color="yellow" />
        <SevenSegmentDisplay :value="component.color.k.toFixed(0)" color="black" />
      </div>
      <!-- <div class="target-colors" v-else>
        <SevenSegmentDisplay :value="0" color="cyan" />
        <SevenSegmentDisplay :value="0" color="magenta" />
        <SevenSegmentDisplay :value="0" color="yellow" />
        <SevenSegmentDisplay :value="0" color="black" />
      </div> -->
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";

import SevenSegmentDisplay from "@/components/SevenSegmentDisplay.vue";
import ShipComponent from "@/classes/ShipComponent";
import LaserBeam from "@/components/LaserBeam.vue";

import Ship from "@/classes/Ship";
import Asteroid from "@/classes/Asteroid";
import MiningLaser from "@/classes/MiningLaser";

export default defineComponent({
  name: "ComponentLaser",
  components: {
    SevenSegmentDisplay,
    LaserBeam
  },
  props: {
    component: {
      type: MiningLaser,
      required: true
    },
    ship: {
      type: Ship,
      required: true
    },
    target: {
      type: Asteroid,
      required: false
    },
    targetCoordinates: {
      type: Object,
      required: false
    }
  },
  setup(props) {
    const color = ref({
      c: 0,
      m: 0,
      y: 0,
      k: 0
    });

    function CMYKtoRGB (c: number, m: number, y: number, k: number){
      const result = {r:0, g:0, b:0};
  
      c = c / 100;
      m = m / 100;
      y = y / 100;
      k = k / 100;
  
      result.r = 1 - Math.min( 1, c * ( 1 - k ) + k );
      result.g = 1 - Math.min( 1, m * ( 1 - k ) + k );
      result.b = 1 - Math.min( 1, y * ( 1 - k ) + k );
  
      result.r = Math.round( result.r * 255 );
      result.g = Math.round( result.g * 255 );
      result.b = Math.round( result.b * 255 );
  
      return result;
    }

    const cssColor = computed(() => {
      const rgb = CMYKtoRGB(props.component.color.c, props.component.color.m, props.component.color.y, props.component.color.k);
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    });

    watch(color, () => {
      console.log(color.value);
      props.component.setColor(color.value);
    });

    return {
      color,
      cssColor
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
  padding: 0.2rem;
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
.colors {
  border-radius: 0.6rem;
  overflow: hidden;
  flex: 5rem;
  padding: 1rem;
  background: #262626;
  border: 0.1rem solid #111;
  font-size: 1rem;
}
</style>
