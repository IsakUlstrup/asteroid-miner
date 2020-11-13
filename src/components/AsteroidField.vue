<template>
  <canvas ref="canvas" id="canvas">
    canvas not supported
  </canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
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
    const asteroids: Asteroid[] = reactive([]);
    let ctx: CanvasRenderingContext2D | null;
    let targetObject: Asteroid | undefined = undefined;
    // const dpr = window.devicePixelRatio;
    // const dpr = config.resolutionScaling;

    const canvasSize = {
      w: 100,
      h: 100
    };

    function setupCanvas(canvas: HTMLCanvasElement) {
      // Get the device pixel ratio, falling back to 1.
      // const dpr = window.devicePixelRatio || 1;
      // console.log(window.devicePixelRatio);
      // Get the size of the canvas in CSS pixels.
      const rect = canvas.getBoundingClientRect();
      // console.log(rect.width, rect.height);
      // Give the canvas pixel dimensions of their CSS
      // size * the device pixel ratio.
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.width = rect.width * config.resolutionScaling;
      canvas.height = rect.height * config.resolutionScaling;
      canvasSize.w = canvas.width / config.resolutionScaling;
      canvasSize.h = canvas.height / config.resolutionScaling;
      // resize canvas to fit container
      // fitToContainer(canvas);
      const ctx = canvas.getContext("2d");
      // Scale all drawing operations by the config.resolutionScaling, so you
      // don't have to worry about the difference.
      if (ctx) ctx.scale(config.resolutionScaling, config.resolutionScaling);
      return ctx;
    }

    function handleClick(event: MouseEvent) {
      const x = event.pageX,
        y = event.pageY;

      // get asteroids that overlap click coordinates
      const hits = asteroids.filter(asteroid => {
        return (
          y > asteroid.position.y * canvasSize.h &&
          y < asteroid.position.y * canvasSize.h + asteroid.size.h &&
          x > asteroid.position.x * canvasSize.w &&
          x < asteroid.position.x * canvasSize.w + asteroid.size.w
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

    const targetCoords = reactive({
      x: 0,
      y: 0,
      active: false
    });

    function targetAtPosition(x: number, y: number) {
      // get asteroids that overlap click coordinates
      const hits = asteroids.filter(asteroid => {
        return (
          y > asteroid.position.y * canvasSize.h &&
          y < asteroid.position.y * canvasSize.h + asteroid.size.h &&
          x > asteroid.position.x * canvasSize.w &&
          x < asteroid.position.x * canvasSize.w + asteroid.size.w
        );
      });
      if (hits.length > 0) {
        return hits[0];
      }
    }

    function handleMouseMove(event: MouseEvent) {
      targetCoords.x = event.clientX;
      targetCoords.y = event.clientY;
      if (targetCoords.active)
        console.log(targetAtPosition(targetCoords.x, targetCoords.y));
    }

    function handleTouchMove(event: TouchEvent) {
      event.preventDefault();
      targetCoords.active = true;
      targetCoords.x = event.touches[0].clientX;
      targetCoords.y = event.touches[0].clientY;
      if (targetCoords.active)
        console.log(targetAtPosition(targetCoords.x, targetCoords.y));
    }

    function setup(canvas: HTMLCanvasElement) {
      // fitToContainer(canvas);
      ctx = setupCanvas(canvas);

      window.addEventListener("resize", () => {
        ctx = setupCanvas(canvas);
      });

      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("touchmove", handleTouchMove);

      canvas.addEventListener("mousedown", () => {
        targetCoords.active = true;
      });

      canvas.addEventListener("mouseup", () => {
        targetCoords.active = false;
      });
      canvas.addEventListener("mouseleave", () => {
        targetCoords.active = false;
      });
      canvas.addEventListener("touchend", () => {
        targetCoords.active = false;
      });
      canvas.addEventListener("touchcancel", () => {
        targetCoords.active = false;
      });

      canvas.addEventListener("click", (event: MouseEvent) => {
        handleClick(event);
      });
    }

    function update(dt: number) {
      // asteroids
      asteroids.forEach(asteroid => {
        asteroid.update(dt, props.ship.position);
        // remove off screen asteroids
        if (
          asteroid.position.x * canvasSize.w + asteroid.size.w < 0 ||
          asteroid.position.y * canvasSize.h + asteroid.size.h < 0 ||
          asteroid.position.z < props.ship.position ||
          asteroid.dimensions.s <= 0 ||
          asteroid.position.x * canvasSize.w > canvasSize.w ||
          asteroid.position.y * canvasSize.w > canvasSize.h
        ) {
          // console.log("asteroid", asteroid.name, "is offscreen, remove");
          asteroids.splice(asteroids.indexOf(asteroid), 1);
          if (asteroid === targetObject) {
            targetObject = undefined;
            context.emit("target", undefined);
          }
        }
      });

      // spawn new asteroids if count is below max
      if (asteroids.length < config.asteroidMaxCount) {
        // console.log("new asteroid", props.ship.position);
        asteroids.push(new Asteroid(props.ship.position));
      }
    }

    function draw(
      ctx: CanvasRenderingContext2D,
      canvasWidth: number,
      canvasHeight: number
    ) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      // draw asteroids
      asteroids.forEach(asteroid => {
        asteroid.draw(ctx, canvasWidth, canvasHeight);
      });

      const equipmentSpacing = canvasWidth / props.ship.equipmentSlots;
      // lasers
      for (let index = 0; index < props.ship.equipment.length; index++) {
        const e = props.ship.equipment[index];
        if (e.type === EquipmentType.laser) {
          if (targetObject) {
            new Beam(
              equipmentSpacing * index,
              canvasHeight,
              targetObject,
              e.derivedStats.effect
            ).draw(ctx, canvasWidth, canvasHeight, e.color);
          }
        }
      }

      // canvas frame, debug
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgb(255, 0, 100)";
      if (canvasSize) {
        ctx.strokeRect(0, 0, canvasSize.w, canvasSize.h);
        // debug crosshair
        if (targetCoords.active) {
          ctx.strokeRect(
            targetCoords.x - 10 / 2,
            targetCoords.y - 10 / 2,
            10,
            10
          );
        }
      }

      // draw debug ui
      ctx.font = "14px Arial";
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText(
        `${canvasWidth * config.resolutionScaling} x ${canvasHeight *
          config.resolutionScaling} | FPS: ${(
          1000 / GameLoop.timing.dt
        ).toFixed(1)} | asteroids: ${asteroids.length}`,
        10,
        20
      );
    }

    GameLoop.addListener((dt: number) => {
      if (ctx && canvas.value) update(dt);
      if (ctx) draw(ctx, canvasSize.w, canvasSize.h);
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
canvas {
  width: 100%;
  height: 100%;
}
</style>
