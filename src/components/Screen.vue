<template>
  <div class="screen-container">
    <div class="screen crt">
      <div class="hud">
        <InventoryDisplay
          :inventory="ship.inventory"
          :inventory-size="ship.inventorySize"
        />
      </div>
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, toRefs } from "vue";
import InventoryDisplay from "@/components/HUDInventoryMeter.vue";
import { resizeCanvas } from "@/services/Utils";
import Ship from "@/classes/Ship";

import SpaceGame from "@/classes/SpaceGame";

export default defineComponent({
  name: "Screen",
  components: {
    InventoryDisplay
  },
  props: {
    resolution: {
      type: Number,
      default: 0.75
    },
    oneBit: {
      type: Boolean,
      default: false
    },
    oneBitColor: {
      type: String,
      default: "rgb(255, 255, 255)"
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
      return `${(1 / resolution.value) * 2}px`;
    });

    onMounted(() => {
      // setup canvas
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // set initial canvas size
        resizeCanvas(ctx, props.resolution);
        // setup and start space game
        const game = new SpaceGame(ctx, props.ship, props.resolution);
        game.start();

        // resize canvas on window resize
        window.addEventListener("resize", () => {
          if (ctx) {
            resizeCanvas(ctx, props.resolution);
          }
        });
      }
    });
    return {
      filterSize
    };
  }
});
</script>

<style scoped vars="{ filterSize }">
/* http://aleclownes.com/2017/02/01/crt-display.html */
.crt::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0.8;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
    linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.06),
      rgba(0, 255, 0, 0.02),
      rgba(0, 0, 255, 0.06)
    );
  z-index: 2;
  background-size: 100% var(--filterSize), var(--filterSize) 100%;
  pointer-events: none;
}
.screen-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.hud {
  width: 20%;
  position: absolute;
  color: white;
  padding: 2rem;
  user-select: none;
  pointer-events: none;
}
.screen {
  width: 100%;
  height: 100%;
}
canvas {
  width: 100%;
  height: 100%;
  user-select: none;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
</style>
