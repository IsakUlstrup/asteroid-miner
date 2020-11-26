<template>
  <div class="meter">
    <span class="progress"></span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "HUDMeter",
  components: {},
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 1
    },
    value: {
      type: Number,
      default: 0.5
    },
    color: {
      type: String,
      default: "yellow"
    }
  },
  setup(props) {
    const progressWidth = computed(() => {
      return (props.value / props.max) * 100 + "%";
    });
    const backgroundColor = computed(() => {
      return props.color;
    });

    return {
      progressWidth,
      backgroundColor
    };
  }
});
</script>

<style scoped lang="scss" vars="{ progressWidth, backgroundColor }">
.meter {
  width: 100%;
  height: 2rem;
  border: 1px solid white;
  padding: 0.2rem;
}
.progress {
  width: var(--progressWidth);
  display: inline-block;
  height: 100%;
  background: var(--backgroundColor);
}
</style>
