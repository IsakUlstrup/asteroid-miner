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
      default: 0.25
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
      default: 2
    }
  },
  emits: ["size"],
  setup(props, context) {
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    const asteroids: Asteroid[] = [];
    // const maxAsteroids = 1;
    const { resolution, oneBit } = toRefs(props);
    const cursor = {
      x: 0,
      y: 0,
      active: false
    };
    let target: Asteroid;

    function randomIntFromInterval(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function isWithinCircle(
      cursorX: number,
      cursorY: number,
      circleX: number,
      circleY: number,
      circleR: number
    ) {
      const y = cursor.y - circleY;
      const x = cursor.x - circleX;
      const dist = Math.sqrt(y * y + x * x);

      if (dist < circleR) {
        // coords are within circle
        return true;
      }
      return false;
    }

    function resize(
      canvas: HTMLCanvasElement,
      context: CanvasRenderingContext2D
    ) {
      // resize whith aspect ratio
      canvas.height = canvas.getBoundingClientRect().height * props.resolution;
      // canvas.width = canvas.getBoundingClientRect().width * props.resolution;
      canvas.width = canvas.getBoundingClientRect().width * props.resolution;
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

    function isOffscreen(x: number, y: number, s: number) {
      // console.log(s);
      if (x < 0 || x > 1 || y < 0 || y > 1 || s < 0 || s > 10) {
        // console.log("offscreen");
        return true;
      } else {
        return false;
      }
    }

    function update(dt: number) {
      // add new asteroids if current amount is below max
      if (asteroids.length < props.maxAsteroids) {
        addAsteroid(asteroids);
      }
      // update asteroids
      asteroids.forEach(asteroid => {
        asteroid.update(dt);
        if (isOffscreen(asteroid.x, asteroid.y, asteroid.ps)) {
          asteroids.splice(asteroids.indexOf(asteroid), 1);
        }
      });

      // sort asteroids based on z-position
      asteroids.sort((a1, a2) => {
        return a1.ps - a2.ps;
      });

      // hit scan, loop asteroids backwards to find frontmost asteroid first
      for (let index = asteroids.length - 1; index >= 0; index--) {
        const asteroid = asteroids[index];
        if (
          isWithinCircle(
            cursor.x,
            cursor.y,
            asteroid.px,
            asteroid.py,
            asteroid.radius * 2 * asteroid.ps
          )
        ) {
          console.log("target aquired.", asteroid.color);
          target = asteroid;
          break;
        }
      }

      // console.log(asteroids[0].px, asteroids[0].py, asteroids[0].z, "s", asteroids[0].ps);
    }

    function cursorActive() {
      cursor.active = true;
    }
    function cursorInactive() {
      cursor.active = false;
    }
    function cursorMove(event: MouseEvent | TouchEvent) {
      event.preventDefault();
      if (event.type === "touchmove") {
        const touch = event as TouchEvent;
        const x = touch.touches[0].clientX;
        const y = touch.touches[0].clientY;

        if (x && y) {
          cursor.x = x;
          cursor.y = y;
        }
      } else if (event.type === "mousemove") {
        const move = event as MouseEvent;
        const x = move.clientX;
        const y = move.clientY;

        if (x && y) {
          cursor.x = x;
          cursor.y = y;
        }
      }
    }

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

      // cursor
      if (cursor.active) {
        context.strokeStyle = "rgb(255, 255, 255)";
        context.strokeRect(cursor.x - 10, cursor.y - 10, 20, 20);
      }
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

        ["mousedown", "touchstart"].forEach(evt => {
          canvas?.addEventListener(evt, cursorActive, false);
        });
        ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach(evt => {
          canvas?.addEventListener(evt, cursorInactive, false);
        });

        canvas.addEventListener("mousemove", (event: MouseEvent) => {
          cursorMove(event);
        });
        canvas.addEventListener("touchmove", (event: TouchEvent) => {
          cursorMove(event);
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
  /* display: block;
  margin: 0 auto;
  border: 3px solid black; */
  width: 100%;
  height: 100%;
  user-select: none;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
</style>
