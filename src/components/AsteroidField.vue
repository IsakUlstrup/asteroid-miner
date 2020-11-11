<template>
  <canvas ref="canvas" id="canvas" width="150" height="150">
    canvas not supported
  </canvas>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import GameLoop from "@/GameLoop";
import Asteroid from "@/classes/Asteroid";
import config from "@/config";
import Ship from "@/classes/Ship";
import { EquipmentType } from '@/types';

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

    function fitToContainer(canvas: HTMLCanvasElement) {
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      console.log("canvas dimensions", canvas.width, canvas.height);
    }

    function setCanvasSize() {
      if (canvas.value) fitToContainer(canvas.value);
    }

    const ctx = computed(() => {
      if (canvas.value) {
        return canvas.value.getContext("2d");
      } else {
        return false;
      }
    });

    let targetObject: Asteroid | undefined = undefined;

    onMounted(() => {
      setCanvasSize();
      window.addEventListener("resize", setCanvasSize);

      if (canvas.value)
        canvas.value.addEventListener("click", (event: MouseEvent) => {
          const x = event.pageX,
            y = event.pageY;

          // Collision detection between clicked offset and element.
          asteroids.forEach((asteroid: Asteroid) => {
            if (
              canvas.value &&
              y > asteroid.position.y * canvas.value.height &&
              y <
                asteroid.position.y * canvas.value.height +
                  asteroid.dimensions.h &&
              x > asteroid.position.x * canvas.value.width &&
              x <
                asteroid.position.x * canvas.value.width + asteroid.dimensions.w
            ) {
              asteroid.clicked = !asteroid.clicked;
              if (asteroid.clicked) {
                targetObject = asteroid;
                context.emit("target", asteroid);
              } else {
                targetObject = undefined;
                context.emit("target", undefined);
              }
              console.log(asteroid.clicked);
              // console.log("clicked an element", asteroid);
            } else {
              asteroid.clicked = false;
            }
          });
        });

      if (canvas.value) {
        for (let index = 0; index < config.asteroidMaxCount; index++) {
          asteroids[index] = new Asteroid();
        }
      }
    });

    let debugDt = 0;

    function update(dt: number) {
      debugDt = dt;
      asteroids.forEach(asteroid => {
        asteroid.position.x += asteroid.vector.x * dt;
        asteroid.position.y += asteroid.vector.y * dt;
      });
    }

    function draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // draw asteroids
      asteroids.forEach(asteroid => {
        ctx.fillStyle = `rgb(${asteroid.color.r}, ${asteroid.color.g}, ${asteroid.color.b})`;
        ctx.strokeStyle = "rgb(255, 255, 255)";
        if (asteroid.clicked) {
          ctx.lineWidth = 1;
          ctx.strokeRect(
            asteroid.position.x * canvas.width,
            asteroid.position.y * canvas.height,
            asteroid.dimensions.w,
            asteroid.dimensions.h
          );
          ctx.fillRect(
            asteroid.position.x * canvas.width,
            asteroid.position.y * canvas.height,
            asteroid.dimensions.w,
            asteroid.dimensions.h
          );
        } else {
          ctx.fillRect(
            asteroid.position.x * canvas.width,
            asteroid.position.y * canvas.height,
            asteroid.dimensions.w,
            asteroid.dimensions.h
          );
        }
      });

      const equipmentSpacing = canvas.width / props.ship.equipmentSlots;
      // lasers
      for (let index = 0; index < props.ship.equipment.length; index++) {
        const e = props.ship.equipment[index];
        if (e.type === EquipmentType.laser) {
          if (targetObject) {
            ctx.strokeStyle = `rgba(255, 0, 0, ${e.derivedStats.effect})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "red";
            ctx.lineWidth = e.derivedStats.effect * 5;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(equipmentSpacing * index, canvas.height);
            ctx.lineTo(
              targetObject.position.x * canvas.width +
                targetObject.dimensions.w / 2,
              targetObject.position.y * canvas.height +
                targetObject.dimensions.h / 2
            );
            ctx.closePath();
            ctx.stroke();
          }
        }
      }
      ctx.shadowBlur = 0;

      // draw debug ui
      ctx.font = "14px Arial";
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText(
        `canvas dimensions: ${canvas.width} x ${canvas.height} | FPS: ${(1000 / debugDt).toFixed(1)}`,
        10,
        20
      );
    }

    GameLoop.addListener((dt: number) => {
      update(dt);
      if (ctx.value && canvas.value) draw(ctx.value, canvas.value);
    });

    return {
      canvas
    }
  }
});
</script>

<style scoped lang="scss" vars="{}">
// .wrapper {
//   width: 100%;
//   height: 100%;
// }
</style>
