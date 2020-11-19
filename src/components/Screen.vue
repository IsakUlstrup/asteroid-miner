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
import Beam from "@/classes/Beam";
import CursorTracker from "@/services/CursorTracker";
import {
  randomInt,
  isWithinCircle,
  resizeCanvas,
  getScaledCanvasDimendsions
} from "@/services/Utils";
import gameLoop from "@/GameLoop";
// import Color from "@/classes/Color";
import Ship from "@/classes/Ship";
import { EquipmentType } from "@/types/enums";

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
    },
    aspectRatio: {
      type: Number,
      default: 1.5
    },
    maxAsteroids: {
      type: Number,
      default: 10
    },
    ship: {
      type: Ship,
      required: true
    }
  },
  emits: ["size", "target"],
  setup(props, context) {
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    const asteroids: Asteroid[] = [];
    const { resolution } = toRefs(props);
    let target: Asteroid | undefined;
    let cursor: CursorTracker;

    function addAsteroid(asteroids: Asteroid[]) {
      const radius = 50;
      asteroids.push(
        new Asteroid(
          randomInt(4, 9),
          radius,
          props.oneBit
            ? { c: 100, m: 100, y: 100, k: 100 }
            : {
                c: Math.random() * 100,
                m: Math.random() * 100,
                y: Math.random() * 100,
                k: Math.random() * 10
              }
        )
      );
    }

    function update(dt: number) {
      // add new asteroids if current amount is below max
      if (asteroids.length < props.maxAsteroids) {
        addAsteroid(asteroids);
      }
      // update asteroids
      asteroids.forEach(asteroid => {
        asteroid.update(dt);
        if (asteroid.isOffscreen) {
          asteroids.splice(asteroids.indexOf(asteroid), 1);
        }
      });

      // sort asteroids based on z-position
      asteroids.sort((a1, a2) => {
        return a1.ps - a2.ps;
      });

      // hit scan, loop asteroids backwards to find frontmost asteroid first
      target = undefined;
      for (let index = asteroids.length - 1; index >= 0; index--) {
        const asteroid = asteroids[index];
        if (
          cursor.active &&
          isWithinCircle(
            cursor.x,
            cursor.y,
            asteroid.px,
            asteroid.py,
            asteroid.radius * asteroid.ps
          )
        ) {
          // mine if any laser is active and wehave a target
          target = asteroid;
          props.ship.equipment.forEach(equipment => {
            if (
              target &&
              equipment.type === EquipmentType.laser &&
              equipment.state.powerModifier > 0 &&
              equipment.state.energy > equipment.derivedStats.energyUse
            ) {
              const equipmentEffect = equipment.use() * dt;
              const mined = target.mine({
                c: equipment.color.cmyk().c * equipmentEffect,
                m: equipment.color.cmyk().m * equipmentEffect,
                y: equipment.color.cmyk().y * equipmentEffect,
                k: equipment.color.cmyk().k * equipmentEffect
              });
              console.log("generate loot", mined);
            }
          });
          break;
        }
      }
      context.emit("target", target);
    }

    function draw(context: CanvasRenderingContext2D) {
      context.clearRect(
        0,
        0,
        context.canvas.width * (1 / props.resolution),
        context.canvas.height * (1 / props.resolution)
      );
      context.imageSmoothingEnabled = false;
      context.save();

      // draw asteroids
      asteroids.forEach(asteroid => {
        asteroid.draw(context, resolution.value);
      });

      // beams
      if (cursor.active) {
        const equipmentSpacing =
          getScaledCanvasDimendsions(context.canvas, props.resolution).width /
          props.ship.equipment.length;

        // loop ship equipment, draw laser for each laser equipment
        for (let index = 0; index < props.ship.equipment.length; index++) {
          const equipment = props.ship.equipment[index];
          // draw laser if its powered
          if (
            equipment.type === EquipmentType.laser &&
            equipment.state.powerModifier > 0 &&
            equipment.state.energy > equipment.derivedStats.energyUse
          ) {
            // laser
            new Beam(
              equipmentSpacing * index,
              getScaledCanvasDimendsions(
                context.canvas,
                props.resolution
              ).height,
              cursor.x,
              cursor.y,
              1
            ).draw(context, equipment.color);
          }
        }
      }

      context.restore();
    }

    watch(resolution, () => {
      if (canvas && ctx) resizeCanvas(ctx, props.resolution);
      if (canvas && ctx)
        context.emit("size", {
          w: ctx.canvas.width,
          h: ctx.canvas.height
        });
    });

    // watch(oneBit, () => {
    //   if (oneBit.value === true) {
    //     asteroids.forEach(a => a.setColor(props.oneBitColor));
    //   } else {
    //     asteroids.forEach(a =>
    //       a.setColor(
    //         `rgb(${Math.random() * 255}, ${Math.random() *
    //           255}, ${Math.random() * 255})`
    //       )
    //     );
    //   }
    // });

    const filterSize = computed(() => {
      return `${(1 / resolution.value) * 2}px`;
    });

    onMounted(() => {
      // setup canvas
      canvas = document.getElementById("canvas") as HTMLCanvasElement;
      if (canvas) ctx = canvas.getContext("2d");
      if (ctx) {
        // set initial canvas size
        resizeCanvas(ctx, props.resolution);

        // resize canvas on window resize
        window.addEventListener("resize", () => {
          if (ctx) resizeCanvas(ctx, props.resolution);
        });

        // setup cursor tracker
        cursor = new CursorTracker(ctx.canvas);

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
