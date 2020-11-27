<template>
  <div class="target-mode-select">
    <input type="radio" id="none" name="target-mode" :value="TargetMode.none" />
    <label for="none">None</label>
    <br />

    <input
      type="radio"
      id="manual"
      name="target-mode"
      :value="TargetMode.manual"
    />
    <label for="manual">Manual</label>
    <br />

    <input type="radio" id="auto" name="target-mode" :value="TargetMode.auto" />
    <label for="auto">Auto</label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { TargetMode } from "@/types/enums";

export default defineComponent({
  name: "UITargetModeSelect",
  components: {},
  props: {},
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
