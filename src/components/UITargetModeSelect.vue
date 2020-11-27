<template>
  <form class="target-mode-select">
    <input
      type="radio"
      :id="module.id + '-none'"
      :name="module.id"
      :value="TargetMode.none"
      @click="module.setTargetingMode(TargetMode.none)"
    />
    <label :for="module.id + '-none'">None</label>
    <br />

    <input
      type="radio"
      :id="module.id + '-manual'"
      :name="module.id"
      :value="TargetMode.manual"
      @click="module.setTargetingMode(TargetMode.manual)"
    />
    <label :for="module.id + '-manual'">Manual</label>
    <br />

    <input
      type="radio"
      :id="module.id + '-auto'"
      :name="module.id"
      :value="TargetMode.auto"
      @click="module.setTargetingMode(TargetMode.auto)"
    />
    <label :for="module.id + '-auto'">Auto</label>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { TargetMode } from "@/types/enums";
import Module from "@/classes/Module";

export default defineComponent({
  name: "UITargetModeSelect",
  components: {},
  props: {
    module: {
      type: Module,
      required: true
    }
  },
  emits: ["color"],
  setup(props) {
    return {
      TargetMode
    };
  }
});
</script>

<style scoped lang="scss">
input[type="range"] {
  width: 100%;
}
</style>
