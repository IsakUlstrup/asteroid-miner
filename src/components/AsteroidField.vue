<template>
  <canvas ref="canvas" id="canvas" width="150" height="150">
    canvas not supported
  </canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import GameLoop from "@/GameLoop";
import Asteroid from "@/classes/Asteroid";
import config from "@/config";
import Ship from "@/classes/Ship";
import Beam from "@/classes/Beam";
import { EquipmentType } from "@/types";

export default defineComponent({
  name: "AsteroidField",
  props: {
    ship: {
      type: Ship,
      required: true
    }
  },
  emits: ["target"],
  setup(props, context) {
    const canvas = ref<HTMLCanvasElement>();
    const asteroids: Asteroid[] = [];
    let ctx: CanvasRenderingContext2D | null;
    let targetObject: Asteroid | undefined = undefined;

    // https://www.html5rocks.com/en/tutorials/canvas/hidpi/
    function setupCanvas(canvas: HTMLCanvasElement) {
      // Get the device pixel ratio, falling back to 1.
      const dpr = window.devicePixelRatio || 1;
      // Get the size of the canvas in CSS pixels.
      const rect = canvas.getBoundingClientRect();
      // Give the canvas pixel dimensions of their CSS
      // size * the device pixel ratio.
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      // resize canvas to fit container
      // fitToContainer(canvas);
      const ctx = canvas.getContext("2d");
      // Scale all drawing operations by the dpr, so you
      // don't have to worry about the difference.
      if (ctx) ctx.scale(dpr, dpr);
      return ctx;
    }

    function handleClick(event: MouseEvent, canvas: HTMLCanvasElement) {
      const x = event.pageX,
        y = event.pageY;

      // get asteroids that overlap click coordinates
      const hits = asteroids.filter(asteroid => {
        return (
          y > asteroid.position.y * canvas.height &&
          y < asteroid.position.y * canvas.height + asteroid.dimensions.h &&
          x > asteroid.position.x * canvas.width &&
          x < asteroid.position.x * canvas.width + asteroid.dimensions.w
        );
      });

      // set target
      if (hits.length > 0) {
        const target = hits[0];
        target.clicked = !target.clicked;
        if (targetObject) targetObject.clicked = false;
        if (target.clicked) {
          targetObject = target;
          context.emit("target", target);
        } else {
          // this is messy, change it later
          if (targetObject) targetObject.clicked = false;
          targetObject = undefined;
          context.emit("target", undefined);
        }
      } else {
        if (targetObject) targetObject.clicked = false;
        targetObject = undefined;
        context.emit("target", undefined);
      }
    }

    function setup(canvas: HTMLCanvasElement) {
      ctx = setupCanvas(canvas);

      window.addEventListener("resize", () => {
        ctx = setupCanvas(canvas);
      });

      canvas.addEventListener("click", (event: MouseEvent) => {
        if (canvas) handleClick(event, canvas);
      });
    }

    function update(dt: number) {
      // asteroids
      asteroids.forEach(asteroid => {
        asteroid.update(dt);
        // remove off screen asteroids
        if (
          asteroid.position.x < 0 ||
          asteroid.position.y < 0 ||
          (canvas.value && asteroid.position.x > canvas.value.width) ||
          (canvas.value && asteroid.position.y > canvas.value.height)
        ) {
          // console.log("asteroid", asteroid.name, "is offscreen, remove");
          asteroids.splice(asteroids.indexOf(asteroid), 1);
        }
      });

      // spawn new asteroids if count is below max
      if (asteroids.length < config.asteroidMaxCount) {
        asteroids.push(new Asteroid());
      }
    }

    function draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // draw asteroids
      asteroids.forEach(asteroid => {
        asteroid.draw(ctx, canvas);
      });

      const equipmentSpacing = canvas.width / props.ship.equipmentSlots;
      // lasers
      for (let index = 0; index < props.ship.equipment.length; index++) {
        const e = props.ship.equipment[index];
        if (e.type === EquipmentType.laser) {
          if (targetObject) {
            new Beam(
              equipmentSpacing * index,
              canvas.height,
              targetObject,
              e.derivedStats.effect
            ).draw(ctx, canvas);
          }
        }
      }

      // draw debug ui
      ctx.font = "14px Arial";
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText(
        `${canvas.width} x ${canvas.height} | FPS: ${(
          1000 / GameLoop.timing.dt
        ).toFixed(1)} | asteroids: ${asteroids.length}`,
        10,
        20
      );
    }

    GameLoop.addListener((dt: number) => {
      if (ctx && canvas.value) update(dt);
      if (ctx && canvas.value) draw(ctx, canvas.value);
    });

    onMounted(() => {
      if (canvas.value) {
        setup(canvas.value);
      }
    });

    return {
      canvas
    };
  }
});
</script>

<style scoped lang="scss" vars="{}">
// .wrapper {
//   width: 100%;
//   height: 100%;
// }
canvas {
  width: 100%;
  height: 100%;
}
</style>
