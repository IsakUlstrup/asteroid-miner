<template>
  <svg
    class="asteroid"
    preserveAspectRatio="xMidYMid meet"
    x="100"
    y="100"
    viewBox="0 0 200 200"
    pointer-events="none"
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
    <g
      :filter="`url(#${asteroid.id})`"
      :transform="`rotate(${r} 100 100)`"
      @click="setTarget"
      @trouchend="setTarget"
      pointer-events="visiblePainted"
    >
      <path
        v-for="path in paths"
        :key="path"
        :d="path.attributes.d.value"
        :fill="path.attributes.fill.value"
        :shape-rendering="config.svgShapeRendering"
      ></path>
    </g>
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import GameLoop from "@/GameLoop";
import trianglify from "trianglify";
import Asteroid from "@/classes/Asteroid";

import config from "@/config";

export default defineComponent({
  name: "Asteroid",
  components: {},
  props: {
    asteroid: {
      type: Asteroid,
      required: true
    },
    shipPosition: {
      type: Number,
      default: 0
    }
  },
  emits: ["target"],
  setup(props, context) {
    const x = computed(() => {
      return props.asteroid.position.x + "px";
    });
    const y = computed(() => {
      return props.asteroid.position.y + "px";
    });
    const z = computed(() => {
      return props.asteroid.position.z + "px";
    });
    const r = computed(() => {
      return props.asteroid.position.r;
    });
    const scale = computed(() => {
      // console.log("scale", (props.asteroid.position.z + props.shipPosition) / 50);
      return (props.asteroid.position.z + props.shipPosition) / 50;
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
        const y =
          height / 2 + r * Math.sin(theta) * (Math.random() * roundness);
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

    const colorMatrix = computed(() => {
      return `${props.asteroid.color.r / 255} 0 0 0 0
              0 ${props.asteroid.color.g / 255} 0 0 0
              0 0 ${props.asteroid.color.b / 255} 0 0
              0 0 0 1 0`;
    });

    GameLoop.addListener((dt: number) => {
      props.asteroid.move(
        props.asteroid.vector.x * dt,
        props.asteroid.vector.y * dt,
        props.asteroid.vector.z * dt,
        props.asteroid.vector.r * dt
      );
    });

    const paths = generate(
      (Math.random() + 1) * config.asteroidPolygonModifier
    );

    function setTarget() {
      context.emit("target", props.asteroid);
    }

    return {
      x,
      y,
      z,
      r,
      scale,
      colorMatrix,
      paths,
      setTarget,
      config
    };
  }
});
</script>

<style scoped lang="scss" vars="{ x, y, z, r, scale }">
.asteroid {
  width: 15rem;
  user-select: none;
  position: absolute;
  // left: var(--x);
  // top: var(--y);
  perspective: 100px;
  transform-origin: 50% 50%;
  transform: scale(var(--scale)) translate(var(--x), var(--y));
}
</style>
