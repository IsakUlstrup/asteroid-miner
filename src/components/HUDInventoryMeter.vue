<template>
  <div class="meter">
    <div class="progress">
      <span class="c"></span>
      <span class="m"></span>
      <span class="y"></span>
      <span class="k"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "Laser",
  components: {},
  props: {
    inventory: {
      type: Object,
      required: true
    },
    inventorySize: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const totalColorAmount = computed(() => {
      return (
        props.inventory.c +
        props.inventory.m +
        props.inventory.y +
        props.inventory.k
      );
    });
    const progressWidth = computed(() => {
      return (totalColorAmount.value / props.inventorySize) * 100 + "%";
    });
    const cyanWidth = computed(() => {
      return (props.inventory.c / totalColorAmount.value) * 100 + "%";
    });
    const magentaWidth = computed(() => {
      return (props.inventory.m / totalColorAmount.value) * 100 + "%";
    });
    const yellowWidth = computed(() => {
      return (props.inventory.y / totalColorAmount.value) * 100 + "%";
    });
    const blackWidth = computed(() => {
      return (props.inventory.k / totalColorAmount.value) * 100 + "%";
    });
    return {
      progressWidth,
      cyanWidth,
      magentaWidth,
      yellowWidth,
      blackWidth
    };
  }
});
</script>

<style
  scoped
  lang="scss"
  vars="{ progressWidth, cyanWidth, magentaWidth, yellowWidth, blackWidth }"
>
.meter {
  width: 100%;
  height: 2rem;
  border: 1px solid white;
  padding: 0.2rem;
}
.progress {
  width: var(--progressWidth);
  height: 100%;
}
span {
  display: inline-block;
  height: 100%;
}
.c {
  width: var(--cyanWidth);
  background: cyan;
}
.m {
  width: var(--magentaWidth);
  background: magenta;
}
.y {
  width: var(--yellowWidth);
  background: yellow;
}
.k {
  width: var(--blackWidth);
  background: black;
}
</style>
