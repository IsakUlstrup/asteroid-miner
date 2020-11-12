<template>
  <canvas ref="canvas" id="canvas">
    canvas not supported
  </canvas>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
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
    const dpr = window.devicePixelRatio;

    const canvasSize = {
      w: 100,
      h: 100
    };

    // const canvasSize = computed(() => {
    //   if (canvas.value) {
    //     return {
    //       w: canvas.value.width / dpr,
    //       h: canvas.value.height / dpr
    //     };
    //   } else {
    //     return null;
    //   }
    // });

    // function fitToContainer(canvas: HTMLCanvasElement){
    //   // Make it visually fill the positioned parent
    //   canvas.style.width ='100%';
    //   canvas.style.height='100%';
    //   // ...then set the internal size to match
    //   canvas.width = canvas.offsetWidth;
    //   canvas.height = canvas.offsetHeight;
    // }

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
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvasSize.w = canvas.width / dpr;
      canvasSize.h = canvas.height / dpr;
      // resize canvas to fit container
      // fitToContainer(canvas);
      const ctx = canvas.getContext("2d");
      // Scale all drawing operations by the dpr, so you
      // don't have to worry about the difference.
      if (ctx) ctx.scale(dpr, dpr);
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

    function setup(canvas: HTMLCanvasElement) {
      // fitToContainer(canvas);
      ctx = setupCanvas(canvas);

      window.addEventListener("resize", () => {
        ctx = setupCanvas(canvas);
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
          asteroid.position.x < 0 ||
          asteroid.position.y < 0 ||
          asteroid.position.x > canvasSize.w ||
          asteroid.position.y > canvasSize.h
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
            ).draw(ctx, canvasWidth, canvasHeight);
          }
        }
      }

      // canvas frame, debug
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgb(255, 0, 100)";
      if (canvasSize) {
        ctx.strokeRect(0, 0, canvasSize.w, canvasSize.h);
      }

      // draw debug ui
      ctx.font = "14px Arial";
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText(
        `${canvasWidth} x ${canvasHeight} | FPS: ${(
          1000 / GameLoop.timing.dt
        ).toFixed(1)} | asteroids: ${asteroids.length}`,
        10,
        20
      );
    }

    GameLoop.addListener((dt: number) => {
      if (ctx && canvas.value) update(dt);
      if (ctx && canvasSize) draw(ctx, canvasSize.w, canvasSize.h );
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
