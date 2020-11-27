<template>
  <select v-model="selectedColor">
    <option v-for="color in colors" :key="color" :value="color">
      {{ color.name }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent, watch, ref, PropType } from "vue";

export default defineComponent({
  name: "UIColorSelect",
  components: {},
  props: {
    colors: {
      type: Array as PropType<Array<CMYKColorList>>,
      required: true
    }
  },
  emits: ["color"],
  setup(props, context) {
    const selectedColor = ref(props.colors[0]);

    watch(selectedColor, () => {
      context.emit("color", selectedColor.value.color);
    });

    return {
      selectedColor
    };
  }
});
</script>

<style scoped lang="scss">
input[type="range"] {
  width: 100%;
}
</style>
