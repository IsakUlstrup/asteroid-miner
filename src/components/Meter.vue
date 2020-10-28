<template>
  <div class="meter">
    <span class="label"><slot></slot></span>
    <div class="meter-wrapper">
      <span class="value"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "Meter",
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
<style scoped lang="scss" vars="{cssWidth}">
.meter {
  display: inline-block;
  text-align: left;
  height: 100%;
  max-height: 2rem;
  width: 100%;
}
.meter-wrapper {
  border: 0.1rem solid white;
  box-shadow: 0 0 0.15rem white inset, 0 0 0.15rem white;
  height: 100%;
  width: 100%;
  border-radius: 9999rem;
  overflow: hidden;
  padding: 0.2rem;
}
.label {
  color: lightblue;
  text-align: center;
  text-shadow: 0 0 0.15rem white;
  font-size: 1.2rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif
}
.value {
  width: var(--cssWidth);
  height: 100%;
  background: white;
  border-radius: 9999rem;
  display: block;
  box-shadow: 0 0 0.15rem lightblue;
  transition: width 0.2s ease-out;
}
</style>
