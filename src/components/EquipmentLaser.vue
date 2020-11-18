<template>
  <div class="laser">
    <p v-if="target">
      target: {{ target.name }}
      <br />
      rgb: {{ target.color.rgb().r.toFixed(0) }}, {{ target.color.rgb().g.toFixed(0) }},
      {{ target.color.rgb().b.toFixed(0) }}
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
    <h3 :style="{ color: equipment.color.rgbString() }">Color</h3>
    ({{ equipment.color.rgbString() }})
    <ul>
      <li>
        C <input type="range" min="0" max="100" name="c" v-model="colorInput.c" />
      </li>
      <li>
        M <input type="range" min="0" max="100" name="m" v-model="colorInput.m" />
      </li>
      <li>
        Y <input type="range" max="100" name="y" v-model="colorInput.y" />
      </li>
      <li>
        K <input type="range" max="100" name="k" v-model="colorInput.k" />
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

import Equipment from "../classes/Equipment";
// import MiningLaser from "@/classes/MiningLaser";
import Asteroid from "../classes/Asteroid";

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

    props.equipment.setColor({
      c: +colorInput.c,
      m: +colorInput.m,
      y: +colorInput.y,
      k: +colorInput.k
    });

    watch(colorInput, () => {
      props.equipment.setColor({
        c: +colorInput.c,
        m: +colorInput.m,
        y: +colorInput.y,
        k: +colorInput.k
      });
      // console.log("out", props.equipment.color.rgb());
    });

    function toggleMine() {
      isMining.value = !isMining.value;
    }

    GameLoop.addListener((dt: number) => {
      if (!props.target || !isMining.value || props.target.hp <= 0) {
        isMining.value = false;
        return;
      }
      props.target.mine(props.equipment.use() * dt);
    });

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
