<template>
  <div class="laser">
    <p v-if="target">
      target: {{ target.name }}
      <br />
      rgb: {{ target.color.r.toFixed(0) }}, {{ target.color.g.toFixed(0) }},
      {{ target.color.b.toFixed(0) }}
    </p>
    <h1>{{ equipment.name }}</h1>
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
    <h3>Color</h3>
    <ul>
      <li>
        C <input type="range" max="255" name="c" v-model="colorInput.c" />
      </li>
      <li>
        M <input type="range" max="255" name="m" v-model="colorInput.m" />
      </li>
      <li>
        Y <input type="range" max="255" name="y" v-model="colorInput.y" />
      </li>
      <li>
        K <input type="range" max="255" name="k" v-model="colorInput.k" />
      </li>
    </ul>

    <br />
    <p>mining: {{ isMining }}</p>
    Buffer: {{ equipment.state.energy.toFixed(0) }} /
    {{ equipment.energyBufferSize }}
    <p v-if="target">Target: {{ target.hp.toFixed(0) }}hp</p>
    <input type="button" value="mine" @click="toggleMine" />
    <p>desired energy: {{ equipment.desiredEnergy }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";

import GameLoop from "@/GameLoop";
import Color, { ColorMode } from "@/classes/Color";

import Equipment from "../classes/Equipment";
import Asteroid from "../classes/Asteroid";

// import LaserBeam from "@/components/LaserBeam.vue";

export default defineComponent({
  name: "Laser",
  components: {},
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
    const isMining = ref(false);
    const colorInput = reactive({
      c: 0,
      m: 0,
      y: 0,
      k: 0
    });
    const color = new Color({
      mode: ColorMode.cmyk,
      c: 100,
      m: 10,
      y: 15,
      k: 1
    });
    console.log(color.rgb(), color.cmyk());

    watch(colorInput, () => {
      color.setColor({
        mode: ColorMode.cmyk,
        c: colorInput.c,
        m: colorInput.m,
        y: colorInput.y,
        k: colorInput.k
      });
      console.log(colorInput);
    });

    function update(dt: number) {
      if (!props.target || !isMining.value || props.target.hp <= 0) {
        isMining.value = false;
        return;
      }
      props.target.mine(props.equipment.use() * dt);
    }

    function toggleMine() {
      isMining.value = !isMining.value;
    }

    GameLoop.addListener(update);

    return {
      toggleMine,
      isMining,
      colorInput
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
