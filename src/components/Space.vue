<template>
  <canvas ref="canvas" id="canvas" width="150" height="150">
    canvas not supported
  </canvas>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import GameLoop from "@/GameLoop";
import trianglify from "trianglify";
// import config from "@/config";

export default defineComponent({
  name: "Asteroid",
  setup() {
    class GameObject {
      clicked: boolean;
      color: {
        r: number;
        g: number;
        b: number;
      }
      dimensions: {
        w: number;
        h: number;
      }
      position: {
        x: number;
        y: number;
      };
      vector: {
        x: number;
        y: number;
      };
      constructor() {
        this.clicked = false;
        this.color = {
          r: Math.random() * 255,
          g: Math.random() * 255,
          b: Math.random() * 255
        }
        this.dimensions = {
          w: (Math.random() + 1) * 10,
          h: (Math.random() + 1) * 10
        };
        this.position = {
          x: Math.random(),
          y: Math.random()
        };
        this.vector = {
          x: (Math.random() - 0.5) * 0.00001,
          y: (Math.random() - 0.5) * 0.00001
        };
      }
    }

    const wrapper = ref<HTMLDivElement>();
    const canvas = ref<HTMLCanvasElement>();
    const gameObjects: GameObject[] = [];
    const numberOfObjects = 200;

    // const roundness = 1.2;
    // function generate(numPoints: number) {
    //   const width = 200;
    //   const height = 200;
    //   // generate a spiral using polar coordinates
    //   const points = [];
    //   const NUM_POINTS = numPoints;
    //   let r = 0;
    //   const rStep = width / 2 / NUM_POINTS;
    //   let theta = 0;
    //   const thetaStep = (Math.PI / NUM_POINTS) * 18;
    //   for (let i = 0; i < NUM_POINTS; i++) {
    //     const x = width / 2 + r * Math.cos(theta) * (Math.random() * roundness);
    //     const y =
    //       height / 2 + r * Math.sin(theta) * (Math.random() * roundness);
    //     const point = [x, y];
    //     points.push(point);
    //     r += rStep;
    //     theta = (theta + thetaStep) % (2 * Math.PI);
    //   }

    //   // apply trianglify to convert the points to polygons and apply the color
    //   // gradient
    //   const pattern = trianglify({
    //     height,
    //     width,
    //     xColors: ["rgba(255, 255, 255, 1)", "rgba(100, 100, 100, 1)"],
    //     // xColors: [cssColor.value, darkCssColor.value],
    //     yColors: "match",
    //     variance: 1,
    //     cellSize: 100,
    //     points,
    //     // colorFunction: trianglify.colorFunctions.sparkle(0.1)
    //     colorFunction: trianglify.colorFunctions.shadows(0.25)
    //   });

    //   return pattern.toSVG().childNodes;
    // }

    // function generateAsteroid(sides: number) {
    //   // console.log(generate(10));

    //   interface Path {
    //     p: Path2D;
    //     c: string;
    //   }

    //   interface Test {
    //     paths: Path[];
    //   }
    //   const asteroid: Test = {
    //     paths: []
    //   };
    //   const paths = generate(sides);
    //   // console.log(paths);
    //   // const canvasPaths: Path2D[] = [];
    //   paths.forEach((path: SVGPathElement) => {
    //     // console.log(path.attributes[1].value);
    //     // canvasPaths.push(new Path2D(path.attributes[0].value));
    //     asteroid.paths.push({
    //       p: new Path2D(path.attributes[0].value),
    //       c: path.attributes[1].value
    //     });
    //   });
    //   console.log(asteroid);
    //   return asteroid;
    // }

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

    let targetObject: GameObject | undefined;

    onMounted(() => {
      setCanvasSize();
      window.addEventListener("resize", setCanvasSize);
      if (canvas.value)
        canvas.value.addEventListener("click", (event: MouseEvent) => {
          const x = event.pageX,
            y = event.pageY;
          targetObject = undefined;

          // Collision detection between clicked offset and element.
          gameObjects.forEach((gameObject: GameObject) => {
            if (
              canvas.value &&
              y > gameObject.position.y * canvas.value.height &&
              y < gameObject.position.y * canvas.value.height + gameObject.dimensions.h &&
              x > gameObject.position.x * canvas.value.width &&
              x < gameObject.position.x * canvas.value.width + gameObject.dimensions.w
            ) {
              gameObject.clicked = !gameObject.clicked;
              if (gameObject.clicked) {
                targetObject = gameObject;
              } else {
                targetObject = undefined;
              }
              console.log(gameObject.clicked);
              // console.log("clicked an element", gameObject);
            } else {
              gameObject.clicked = false;
            }
          });
        });

      if (canvas.value) {
        for (let index = 0; index < numberOfObjects; index++) {
          gameObjects[index] = new GameObject();
        }
      }
    });

    let debugDt = 0;

    function update(dt: number) {
      debugDt = dt;
      gameObjects.forEach(go => {
        go.position.x += go.vector.x * dt;
        go.position.y += go.vector.y * dt;
      });
    }

    // function drawInlineSVG(svgElement: SVGElement, ctx: CanvasRenderingContext2D, callback: Function) {
    //   const svgURL = new XMLSerializer().serializeToString(svgElement);
    //   const img = new Image();
    //   img.onload = function() {
    //     ctx.drawImage(this as CanvasImageSource, 0, 0);
    //     callback();
    //   };
    //   img.src = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgURL);
    // }

    // const testAsteroid = generateAsteroid(50);

    // const image = new Image();
    // const svgURL = new XMLSerializer().serializeToString(generate(10));
    // console.log(svgURL);
    // image.src =
    //   "data:image/svg+xml; charset=utf8, " + encodeURIComponent(svgURL);

    function draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // usage:
      // drawInlineSVG(generate(10), ctx, function() {
      //   // console.log(canvas.toDataURL());
      // });

      // ctx.fillStyle = "rgb(255, 255, 255)";
      // image.onload = function() {
      //   ctx.drawImage(this as CanvasImageSource, 50, 50);
      //   console.log(this);
      // };

      // const asteroid = generateAsteroid();
      // testAsteroid.paths.forEach(path => {
      //   ctx.fillStyle = path.c;
      //   ctx.fill(path.p);
      // });

      // draw game objects
      gameObjects.forEach(go => {
        ctx.fillStyle = `rgb(${go.color.r}, ${go.color.g}, ${go.color.b})`;
        ctx.strokeStyle = "rgb(255, 255, 255)";
        if (go.clicked) {
          ctx.strokeRect(
            go.position.x * canvas.width,
            go.position.y * canvas.height,
            go.dimensions.w,
            go.dimensions.h
          );
        } else {
          ctx.fillRect(
            go.position.x * canvas.width,
            go.position.y * canvas.height,
            go.dimensions.w,
            go.dimensions.h
          );
        }
        // mock laser beam
        if (targetObject) {
          ctx.strokeStyle = "rgb(255, 0, 0)";
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2, canvas.height);
          ctx.lineTo(
            targetObject.position.x * canvas.width + targetObject.dimensions.w / 2,
            targetObject.position.y * canvas.height + targetObject.dimensions.h / 2
          );
          ctx.closePath();
          ctx.stroke();
        }
      });

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
      wrapper,
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
