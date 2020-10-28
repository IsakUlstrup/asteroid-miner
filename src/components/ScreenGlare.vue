<template>
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient gradientUnits="userSpaceOnUse" x1="100" y1="0" x2="100" y2="200" id="gradient-0">
        <stop offset="0" style="stop-color: rgba(255, 255, 255, 0.6)"/>
        <stop offset="1" style="stop-color: rgba(255, 255, 255, 0.2)"/>
      </linearGradient>
    </defs>
    <polygon style="fill: url(#gradient-0);" points="50 0 200 0 200 200 0 200"/>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ScreenGlare",
});
</script>

<style scoped lang="scss" vars="{}">
svg {
  position: absolute;
  display: block;
  opacity: 0.2;
}
</style>
