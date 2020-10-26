<template>
  <svg class="asteroid-svg" viewBox="0 0 200 200">
    <path v-for="path in paths" :key="path" :d="path.attributes.d.value" :fill="path.attributes.fill.value" shape-rendering="crispEdges"></path>
  </svg>
</template>

<script>
import { computed, defineComponent, watch, ref, toRefs } from "vue";
import trianglify from "trianglify";

import Asteroid from "@/classes/Asteroid";

export default defineComponent({
  name: "AsteroidDisplay",
  props: {
    asteroid: {
      type: Asteroid,
      required: true
    }
  },
  setup(props) {
    // const { asteroid } = toRefs(props);

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

    const color = computed(() => {
      const rgb = CMYKtoRGB(props.asteroid.c, props.asteroid.m, props.asteroid.y, props.asteroid.k);
      return {r: rgb.r, g: rgb.g, b: rgb.b};
    });

    const cssColor = computed(() => {
      return `rgb(${color.value.r}, ${color.value.g}, ${color.value.b})`;
    });

    function generate(numPoints) {
      const width = 200
      const height = 200
      // generate a spiral using polar coordinates
      const points = []
      const NUM_POINTS = numPoints
      let r = 0
      const rStep = width / 2 / NUM_POINTS
      let theta = 0
      const thetaStep = Math.PI / NUM_POINTS * 18
      for (let i = 0; i < NUM_POINTS; i++) {
        const x = width / 2 + r * Math.cos(theta)
        const y = height / 2 + r * Math.sin(theta)
        const point = [x, y]
        points.push(point)
        r += rStep
        theta = (theta + thetaStep) % (2 * Math.PI)
      }

      // apply trianglify to convert the points to polygons and apply the color
      // gradient
      const pattern = trianglify({
        height,
        width,
        // xColors: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 1)'],
        xColors: [cssColor.value],
        yColors: 'match',
        // variance: 0,
        // cellSize: 200,
        points,
        // colorFunction: trianglify.colorFunctions.sparkle(0.2)
        colorFunction: trianglify.colorFunctions.shadows()
      });

      return pattern.toSVG().childNodes;
    }

    const paths = generate(props.asteroid.hp);

    const size = computed(() => {
      return Math.floor(props.asteroid.hp + 30)+"rem";
    });

    return {
      paths,
      size
    }
  }
});
</script>

<style scoped lang="scss" vars="{ size }">
.asteroid-svg {
  width: var(--size);
  // filter: brightness(0.5) sepia(1) hue-rotate(var(--hue)) saturate(50);
  // overflow: visible;
}
</style>
