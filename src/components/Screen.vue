<template>
  <div class="screen-container">
    <div class="screen crt">
      <div class="hud">
        <!-- FPS: {{ (1000 / gameLoop.timing.dt).toFixed(1) }} -->
      </div>
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, toRefs } from "vue";
import { resizeCanvas } from "@/services/Utils";
import Ship from "@/classes/Ship";
import SpaceGame from "@/classes/SpaceGame";
import gameLoop from "@/services/GameLoop";

export default defineComponent({
  name: "Screen",
  components: {},
  props: {
    resolution: {
      type: Number,
      default: 0.5
    },
    aspectRatio: {
      type: Number,
      default: 1.5
    },
    maxAsteroids: {
      type: Number,
      default: 20
    },
    ship: {
      type: Ship,
      required: true
    }
  },
  setup(props) {
    const { resolution } = toRefs(props);
    const filterSize = computed(() => {
      return `${Math.floor((1 / resolution.value) * 2)}px`;
    });

    onMounted(() => {
      // setup canvas
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // set initial canvas size
        resizeCanvas(ctx, props.resolution);
        // setup and start space game
        const game = new SpaceGame(ctx, props.resolution, props.ship);

        // resize canvas on window resize
        window.addEventListener("resize", () => {
          if (ctx) {
            resizeCanvas(ctx, props.resolution);
          }
        });
      }
    });
    return {
      filterSize,
      gameLoop
    };
  }
});
</script>

<style lang="scss" scoped>
/* http://aleclownes.com/2017/02/01/crt-display.html */
.crt::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0.6;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
    linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.06),
      rgba(0, 255, 0, 0.02),
      rgba(0, 0, 255, 0.06)
    );
  z-index: 2;
  background-size: 100% 2px, 2px 100%;
  // background-size: 100% v-bind(filterSize), v-bind(filterSize) 100%;
  pointer-events: none;
  border-radius: 0.5rem;
}
.screen-container {
  position: relative;
  width: 100%;
  height: 100%;
  border: 0.5rem solid #eee;
  background: #eee;
  border-radius: 1rem;
  overflow: hidden;
}
.hud {
  width: 20%;
  max-width: 150px;
  position: absolute;
  color: white;
  padding: 1rem;
  user-select: none;
  pointer-events: none;
}
.screen {
  width: 100%;
  height: 100%;
}
canvas {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0 15rem rgba($color: #000000, $alpha: 0.7) inset;
  width: 100%;
  height: 100%;
  background: white;
  user-select: none;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
</style>
