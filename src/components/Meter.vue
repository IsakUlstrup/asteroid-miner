<template>
  <div class="meter">
    <ScreenGlare />
    <span class="label"><slot></slot></span>
    <div class="meter-wrapper">
      <span class="value"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import ScreenGlare from "@/components/ScreenGlare.vue";

export default defineComponent({
  name: "Meter",
  components: {
    ScreenGlare
  },
  props: {
    value: {
      type: Number,
      default: 0.15
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 1
    },
    color: {
      type: String,
      default: "orange"
    }
  },
  setup(props) {
    const cssWidth = computed(() => {
      return props.value / props.max * 100+"%";
    });
    return {
      cssWidth
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" vars="{ cssWidth, color }">
.meter {
  display: inline-block;
  position: relative;
  overflow: hidden;
  // text-align: left;
  // height: 100%;
  // // max-height: 2rem;
  // width: 100%;
  display: flex;
  height: 3rem;
  // border: #ddd;
  // background: #eee;
  // box-shadow: 0 0 0.2rem rgba($color: #000000, $alpha: 0.6) inset;
  border-radius: 9999rem;
  // padding: 0.25rem;
}
.meter-wrapper {
  border: 0.1rem solid #ccc;
  box-shadow: 0 0 0.3rem rgba($color: #000000, $alpha: 0.2) inset;
  background: #eee;
  height: 100%;
  width: 100%;
  border-radius: 9999rem;
  overflow: hidden;
}
.label {
  // position: absolute;
  color: #555;
  margin-right: 0.5rem;
  // width: 4rem;
  flex: 4rem;
  font-size: 1.5rem;
  vertical-align: middle;
  text-align: center;
  // left: 50%;
  line-height: 2rem;
  // background: linear-gradient(rgb(255, 222, 32), rgb(255, 174, 0));
  // -webkit-background-clip: text;
  // background-clip: text;
  // -webkit-text-fill-color: transparent;
  // filter: drop-shadow(2px 2px rgb(0, 225, 255));
  // font-size: 1.5rem;
}
.value {
  width: var(--cssWidth);
  height: 100%;
  // background: linear-gradient(to bottom right, rgb(255, 222, 32), rgb(255, 174, 0), rgb(255, 35, 226));
  background: var(--color);
  border-radius: 9999rem;
  display: block;
  box-shadow: 0 0 0.15rem lightblue;
  transition: width 0.2s ease-out;
}
</style>
