<template>
  <div class="laser">
    <h1>{{ module.name }}</h1>
    <p v-if="module.target">
      target cmyk: {{ module.target.color.cmyk().c.toFixed(0) }},
      {{ module.target.color.cmyk().m.toFixed(0) }},
      {{ module.target.color.cmyk().y.toFixed(0) }},
      {{ module.target.color.cmyk().k.toFixed(0) }}
    </p>
    Power:
    <input
      type="range"
      name="power"
      min="0"
      max="1"
      step="0.1"
      @input="module.setPower(+$event.target.value)"
      :value="module.state.powerModifier"
    />
    <h3 :style="{ color: module.color.rgbString() }">Color</h3>
    ({{ module.color.cmykString() }})

    <ColorSelect :colors="colorPresets" @color="setColor" />

    <UITargetModeSelect :module="module" />
    {{ module.targetMode }}

    <br />
    effect: {{ module.derivedStats.effect }}<br />
    energy: {{ module.state.energy.toFixed(0) }}/
    {{ module.derivedStats.energyUse }}w
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Module from "../classes/Module";
import ColorSelect from "@/components/UIColorSelect.vue";
import UITargetModeSelect from "@/components/UITargetModeSelect.vue";

export default defineComponent({
  name: "Laser",
  components: {
    ColorSelect,
    UITargetModeSelect
  },
  props: {
    module: {
      type: Module,
      required: true
    }
  },
  setup(props) {
    const colorPresets = [
      {
        name: "cyan",
        color: { c: 100, m: 0, y: 0, k: 0 }
      },
      {
        name: "magenta",
        color: { c: 0, m: 100, y: 0, k: 0 }
      },
      {
        name: "yellow",
        color: { c: 0, m: 0, y: 100, k: 0 }
      },
      {
        name: "black",
        color: { c: 0, m: 0, y: 0, k: 100 }
      }
    ];
    const selectedColor = ref(colorPresets[0]);

    props.module.setColor(selectedColor.value.color);

    function setColor(color: CMYKColor) {
      props.module.setColor(color);
    }

    return {
      selectedColor,
      colorPresets,
      setColor
    };
  }
});
</script>

<style scoped lang="scss">
input[type="range"] {
  width: 100%;
}
</style>
