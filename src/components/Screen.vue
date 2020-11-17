<template>
  <div class="screen-container">
    <div class="screen crt">
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, toRefs, watch } from "vue";
import Asteroid from "@/classes/Asteroid2";
import gameLoop from "@/GameLoop";

export default defineComponent({
  name: "Screen",
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
    }
  },
  emits: ["size"],
  setup(props, context) {
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    const asteroids: Asteroid[] = [];
    const maxAsteroids = 100;
    const { resolution, oneBit } = toRefs(props);

    function randomIntFromInterval(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function resize(
      canvas: HTMLCanvasElement,
      context: CanvasRenderingContext2D
    ) {
      canvas.width = canvas.getBoundingClientRect().width * props.resolution;
      canvas.height = canvas.getBoundingClientRect().height * props.resolution;
      context.scale(props.resolution, props.resolution);
    }

    function addAsteroid(asteroids: Asteroid[]) {
      const radius = 50;
      asteroids.push(
        new Asteroid(
          randomIntFromInterval(4, 9),
          radius,
          props.oneBit
            ? props.oneBitColor
            : `rgb(${Math.random() * 255}, ${Math.random() *
                255}, ${Math.random() * 255})`
        )
      );
    }

    function isOffscreen(x: number, y: number) {
      if (x < 0 || x > 1 || y < 0 || y > 1) {
        return true;
      } else {
        return false;
      }
    }

    function update(dt: number) {
      // add new asteroids if current amount is below max
      if (asteroids.length < maxAsteroids) {
        addAsteroid(asteroids);
      }
      // update asteroids
      asteroids.forEach(asteroid => {
        asteroid.update(dt);
        if (isOffscreen(asteroid.x, asteroid.y)) {
          asteroids.splice(asteroids.indexOf(asteroid), 1);
        }
      });

      // console.log(asteroids[0].px, asteroids[0].py, asteroids[0].z, "s", asteroids[0].ps);
    }

    // sort asteroids based on z-position
    // asteroids.sort((a1, a2) => {
    //   return a1.ps - a2.ps;
    // });

    function draw(context: CanvasRenderingContext2D) {
      context.clearRect(
        0,
        0,
        context.canvas.width * (1 / props.resolution),
        context.canvas.height * (1 / props.resolution)
      );
      context.imageSmoothingEnabled = false;

      // draw asteroids
      asteroids.forEach(asteroid => {
        asteroid.draw(context, resolution.value);
      });
    }

    watch(resolution, () => {
      if (canvas && ctx) resize(canvas, ctx);
      if (canvas && ctx)
        context.emit("size", {
          w: ctx.canvas.width,
          h: ctx.canvas.height
        });
    });

    watch(oneBit, () => {
      if (oneBit.value === true) {
        asteroids.forEach(a => a.setColor(props.oneBitColor));
      } else {
        asteroids.forEach(a =>
          a.setColor(
            `rgb(${Math.random() * 255}, ${Math.random() *
              255}, ${Math.random() * 255})`
          )
        );
      }
    });

    const filterSize = computed(() => {
      return `${(1 / resolution.value) * 2}px`;
    });

    onMounted(() => {
      // setup canvas
      canvas = document.getElementById("canvas") as HTMLCanvasElement;
      if (canvas) ctx = canvas.getContext("2d");
      if (ctx && canvas) {
        // set initial canvas size
        resize(canvas, ctx);

        // resize canvas on window resize
        window.addEventListener("resize", () => {
          if (canvas && ctx) resize(canvas, ctx);
        });

        // game loop
        gameLoop.addListener((dt: number) => {
          update(dt);
          if (ctx) draw(ctx);
        });
      }
    });
    return {
      filterSize
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
