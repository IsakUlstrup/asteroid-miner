<template>
  <svg class="asteroid-svg" preserveAspectRatio="xMidYMid meet"  x="100"   y="100"  viewBox="0 0 200 200" @click="toggleTarget" @touch="toggleTarget" :class="{targeted: targeted}">
    <defs>
      <filter :id="asteroid.id">
        <feColorMatrix
          color-interpolation-filters="sRGB"
          type="matrix"
          :values="colorMatrix"/>
      </filter>
    </defs>
    <g :filter="`url(#${asteroid.id})`">
      <path v-for="path in paths" :key="path" :d="path.attributes.d.value" :fill="path.attributes.fill.value" shape-rendering="crispEdges"></path>
    </g>
  </svg>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import trianglify from "trianglify";

import Asteroid from "@/classes/Asteroid";

export default defineComponent({
  name: "AsteroidDisplay",
  props: {
    asteroid: {
      type: Asteroid,
      required: true
    },
    targeted: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const roundness = 1.2;

    function CMYKtoRGB (c, m, y, k){
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

    function generate(numPoints) {
      const width = 200;
      const height = 200;
      // generate a spiral using polar coordinates
      const points = [];
      const NUM_POINTS = numPoints;
      let r = 0;
      const rStep = width / 2 / NUM_POINTS;
      let theta = 0;
      const thetaStep = Math.PI / NUM_POINTS * 18;
      for (let i = 0; i < NUM_POINTS; i++) {
        const x = width / 2 + r * Math.cos(theta) * (Math.random() * roundness);
        const y = height / 2 + r * Math.sin(theta) * (Math.random() * roundness);
        const point = [x, y];
        points.push(point);
        r += rStep;
        theta = (theta + thetaStep) % (2 * Math.PI);
      }

      // apply trianglify to convert the points to polygons and apply the color
      // gradient
      const pattern = trianglify({
        height,
        width,
        xColors: ['rgba(255, 255, 255, 1)', 'rgba(100, 100, 100, 1)'],
        // xColors: [cssColor.value, darkCssColor.value],
        yColors: 'match',
        variance: 1,
        cellSize: 100,
        points,
        // colorFunction: trianglify.colorFunctions.sparkle(0.1)
        colorFunction: trianglify.colorFunctions.shadows(0.25)
      });

      return pattern.toSVG().childNodes;
    }

    // const targeted = ref(false);
    function toggleTarget(event) {
      // console.log(event)
      // console.log(event);
      // targeted.value = !targeted.value;
      // if (!props.asteroid.targeted) {
        context.emit("toggle-target", {
          target: props.asteroid,
          x: event.x,
          y: event.y
        });
      // }
    }

    const color = computed(() => {
      const rgb = CMYKtoRGB(props.asteroid.c, props.asteroid.m, props.asteroid.y, props.asteroid.k);
      return {r: rgb.r, g: rgb.g, b: rgb.b};
    });

    const colorMatrix = computed(() => {
      return `${color.value.r / 255} 0 0 0 0
              0 ${color.value.g / 255} 0 0 0
              0 0 ${color.value.b / 255} 0 0
              0 0 0 1 0`
    });

    const rotationDuration = computed(() => {
      return 70 * (Math.random() + 1) + "s";
    });

    const rotationDirection = computed(() => {
      if (Math.random() > 0.5) {
        return "-360deg";
      } else {
        return "360deg";
      }
    });

    const paths = generate(props.asteroid.hp / 3);
    // const size = Math.floor(props.asteroid.hp)+"rem"

    // const size = computed(() => {
    //   return Math.floor(props.asteroid.hp)+"%";
    // });

    return {
      paths,
      // size,
      colorMatrix,
      toggleTarget,
      rotationDuration,
      rotationDirection
    }
  }
});
</script>

<style scoped lang="scss" vars="{ rotationDuration, rotationDirection }">
@keyframes rotate {  
  0% { transform: rotate(0deg); }
  100% { transform: rotate(var(--rotationDirection)); }
}
.asteroid-svg {
  // background: var(--cssColor);
  // filter: url(#color-filter);
  animation: rotate var(--rotationDuration) linear infinite;
  // width: var(--size);
  // height: var(--size);
  // max-height: 20rem;
  // height: 100%;
  // width: auto;
  // width: 10rem;
  border: 0.2rem solid rgba($color: #74eaff, $alpha: 0);
  border-radius: 100%;
  // padding: var(--size);
  // filter: brightness(0.8) sepia(0.3) hue-rotate(var(--hue)) saturate(var(--saturation));
  // overflow: visible;
}
.targeted {
  border: 0.2rem solid rgba($color: #fff, $alpha: 0.5);
  // background: radial-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
  // box-shadow: 0 0 0.5rem rgba($color: #fff, $alpha: 1) inset, 0 0 0.5rem rgba($color: #fff, $alpha: 1);
  // transform: scale(1.1);
  // transform: scale(1.06);
  transition: all 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}
</style>
