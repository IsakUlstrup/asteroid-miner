<template>
  <div class="laser">
    <h1>{{ equipment.name }}</h1>
    <p v-if="target">
      target cmyk: {{ target.color.cmyk().c.toFixed(0) }},
      {{ target.color.cmyk().m.toFixed(0) }},
      {{ target.color.cmyk().y.toFixed(0) }},
      {{ target.color.cmyk().k.toFixed(0) }}
    </p>
    Power:
    <input
      type="range"
      name="power"
      min="0"
      max="1"
      step="0.1"
      @input="equipment.setPower(+$event.target.value)"
      :value="equipment.state.powerModifier"
    />
    <h3 :style="{ color: equipment.color.rgbString() }">Color</h3>
    ({{ equipment.color.cmykString() }})

    <ColorSelect :colors="colorPresets" @color="setColor" />

    <br />
    effect: {{ equipment.derivedStats.effect }}<br />
    energy: {{ equipment.state.energy.toFixed(0) }}/
    {{ equipment.derivedStats.energyUse }}w
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Equipment from "../classes/Equipment";
import Asteroid from "../classes/Asteroid";
import ColorSelect from "@/components/UIColorSelect.vue";

export default defineComponent({
  name: "Laser",
  components: {
    ColorSelect
  },
  props: {
    equipment: {
      type: Equipment,
      required: true
    },
    target: {
      type: Asteroid,
      required: false,
      default: undefined
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

    props.equipment.setColor(selectedColor.value.color);

    function setColor(color: CMYKColor) {
      props.equipment.setColor(color);
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
