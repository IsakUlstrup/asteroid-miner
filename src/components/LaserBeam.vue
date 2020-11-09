<template>
  <div class="laser-beam" ref="beam">
  </div>
  <!-- <div class="hit"></div> -->
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed } from "vue";

export default defineComponent({
  name: "LaserBeam",
  props: {
    color: {
      type: String,
      default: "red"
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    thickness: {
      type: Number,
      default: 5
    }
  },
  setup(props) {
    const { x, y, thickness } = toRefs(props);
    const beam = ref<HTMLDivElement>();

    const beamOrigin = computed(() => {
      if (typeof beam.value !== "undefined") {
        // const target = beam.value as HTMLDivElement;
        return {
          y: beam.value.getBoundingClientRect().y,
          x: beam.value.getBoundingClientRect().x
        };
      }
    });

    // const beamOrigin = ref({
    //   x: 0,
    //   y: 0
    // });

    // window.addEventListener("resize", () => {
    //   if (beam.value) {
    //     beamOrigin.value.x = beam.value.getBoundingClientRect().x;
    //     beamOrigin.value.y = beam.value.getBoundingClientRect().y;
    //   }
    //   // console.log(
    //   //   beam.value?.getBoundingClientRect().x,
    //   //   beam.value?.getBoundingClientRect().y
    //   // );
    // });

    const beamLength = computed(() => {
      if (beamOrigin.value)
        return (
          Math.sqrt(
            (beamOrigin.value.x - x.value) * (beamOrigin.value.x - x.value) +
              (beamOrigin.value.y - y.value) * (beamOrigin.value.y - y.value)
          ) + "px"
        );
    });

    const beamAngle = computed(() => {
      if (beamOrigin.value)
        return (
          (Math.atan2(
            y.value - beamOrigin.value.y,
            x.value - beamOrigin.value.x
          ) *
            180) /
            Math.PI +
          "deg"
        );
    });

    const beamThickness = computed(() => {
      return thickness.value + "px";
    });

    const left = computed(() => {
      return x.value + "px";
    });
    const top = computed(() => {
      return y.value + "px";
    });

    // onMounted(() => {
    //   // the DOM element will be assigned to the ref after initial render
    //   console.log(beam.value) // <div>This is a root element</div>
    //   // if (beam && beam.value) beam.value.
    // });

    // function test(event:Event) {
    //   const target = event.target as HTMLDivElement;
    //   console.log(event);
    //   if(target) console.log(target.getBoundingClientRect())
    // }

    return {
      beamLength,
      beamAngle,
      beam,
      beamOrigin,
      beamThickness,
      left,
      top
    }
  }
});
</script>

<style scoped lang="scss" vars="{ beamLength, beamAngle, beamThickness, color, left, top }">
.laser-beam {
  user-select: none;
  opacity: 0.8;
  position: absolute;
  transform-origin: 0 100%;
  background: var(--color);
  box-shadow: 0 0 8px var(--color);
  height: var(--beamThickness);
  width: var(--beamLength);
  transform: rotate(var(--beamAngle));
  border-radius: var(--beamThickness);
}

.hit {
  // opacity: .8;
  width: 10px;
  height: 10px;
  background: var(--color);
  border-radius: 100%;
  position: fixed;
  left: var(--left);
  top: var(--top);
  box-shadow: 0px 0px 30px var(--color);
}
</style>
