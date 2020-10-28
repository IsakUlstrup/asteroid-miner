<template>
  <div class="seven-segment">
    <span class="value">{{ value }}</span>
    <span class="inactive-didgits">888</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SevenSegmentDisplay",
  props: {
    value: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: "orange"
    }
  }
});
</script>

<style scoped lang="scss" vars="{ color }">
@font-face {
  font-family: DSEG7;
  src: url("../assets/DSEG7Classic-Regular.ttf");
}
// span {
//   display: block;
// }
.seven-segment {
  font-family: DSEG7;
  position: relative;
  // display: inline-block;
  text-align: right;
  background: #262626;
  padding: 1rem;
  color: #333;
  font-size: 1rem;
}
.value {
  position: absolute;
  right: 1rem;
  color: var(--color);
  text-shadow: 0 0 0.2rem var(--color);
}
</style>
