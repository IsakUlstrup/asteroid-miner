<template>
  <div class="dot-matrix-meter">
    <span class="label"><slot>Label</slot></span>
    <span class="value">{{ characters.active }}<span class="inactive" v-if="characters.inactive">{{ characters.inactive }}</span></span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "DotMatrixMeter",
  props: {
    value: {
      type: Number,
      default: 0
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
    // console.log(props.min, props.max, props.value);

    const characters = computed(() => {
      const tenth = props.max / 10;
      const active = Math.floor(props.value / tenth);
      const inactive = tenth - active
      // console.log(active, inactive);
      let activeString = "";
      for (let index = 0; index < active; index++) {
        activeString += "»";
      }
      let inactiveString = "";
      for (let index = 0; index < inactive; index++) {
        inactiveString += "»";
      }
      return {
        active: activeString,
        inactive: inactiveString
      }
    });

    return {
      characters
    }
  }
});
</script>

<style scoped lang="scss" vars="{ color }">
// BPdots
// https://www.fontspace.com/bpdots-font-f4930
@font-face {
  font-family: BPdots;
  src: url("../assets/Bpdotsunicase.otf");
}
.inactive {
  color: #555;
  text-shadow: none;
}
.dot-matrix-meter {
  font-family: BPdots, sans-serif;
  color: var(--color);
  text-shadow: 0 0 0.5rem var(--color);
  display: flex;
  padding-bottom: 0.4rem;
}
.label {
  text-align: right;
  margin-right: 1rem;
}
</style>
