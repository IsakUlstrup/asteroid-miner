<template>
  <svg
    class="asteroid"
    preserveAspectRatio="xMidYMid meet"
    x="100"
    y="100"
    viewBox="0 0 200 200"
  >
    <defs>
      <filter :id="asteroid.id">
        <feColorMatrix
          color-interpolation-filters="sRGB"
          type="matrix"
          :values="colorMatrix"
        />
      </filter>
    </defs>
    <g :filter="`url(#${asteroid.id})`" :transform="`rotate(${r} 100 100)`">
      <path
        v-for="path in paths"
        :key="path"
        :d="path.attributes.d.value"
        :fill="path.attributes.fill.value"
        shape-rendering="crispEdges"
      ></path>
    </g>
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import GameLoop from "@/GameLoop";
import trianglify from "trianglify";
import Asteroid from "@/classes/Asteroid";

export default defineComponent({
  name: "Asteroid",
  components: {},
  setup() {
    const asteroid = new Asteroid();
    const position = reactive({
      x: Math.random() * 2 + 500,
      y: Math.random() * 2 + 200,
      z: (Math.random() - 0.5) * 0.2
    });
    const vector = reactive({
      x: (Math.random() - 0.5) * 0.005,
      y: (Math.random() - 0.5) * 0.005,
      z: (Math.random() - 0.5) * 0.005
    });
    const rotation = reactive({
      r: 0,
      vector: (Math.random() - 0.5) * 0.01
    });

    const x = computed(() => {
      return position.x + "px";
    });
    const y = computed(() => {
      return position.y + "px";
    });
    const z = computed(() => {
      return position.z + "px";
    });
    const r = computed(() => {
      return rotation.r;
    });

    const roundness = 1.2;
    function generate(numPoints: number) {
      const width = 200;
      const height = 200;
      // generate a spiral using polar coordinates
      const points = [];
      const NUM_POINTS = numPoints;
      let r = 0;
      const rStep = width / 2 / NUM_POINTS;
      let theta = 0;
      const thetaStep = (Math.PI / NUM_POINTS) * 18;
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
        xColors: ["rgba(255, 255, 255, 1)", "rgba(100, 100, 100, 1)"],
        // xColors: [cssColor.value, darkCssColor.value],
        yColors: "match",
        variance: 1,
        cellSize: 100,
        points,
        // colorFunction: trianglify.colorFunctions.sparkle(0.1)
        colorFunction: trianglify.colorFunctions.shadows(0.25)
      });

      return pattern.toSVG().childNodes;
    }

    const color = reactive({
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255
    });

    const colorMatrix = computed(() => {
      return `${color.r / 255} 0 0 0 0
              0 ${color.g / 255} 0 0 0
              0 0 ${color.b / 255} 0 0
              0 0 0 1 0`;
    });

    GameLoop.addListener((dt: number) => {
      position.x += vector.x * dt;
      position.y += vector.y * dt;
      position.z += vector.z * dt;
      rotation.r += rotation.vector * dt;
    });

    const paths = generate(Math.random() * 100);

    return {
      asteroid,
      position,
      vector,
      x,
      y,
      z,
      r,
      color,
      colorMatrix,
      paths
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" vars="{ x, y, z, r }">

.asteroid {
  border-radius: 999999rem;
  padding: 1rem;
  width: 10rem;
  display: inline-block;
  user-select: none;
  position: relative;
  transform-origin: center;
  transform: perspective(50px) translate3d(var(--x), var(--y), var(--z));
}
</style>
