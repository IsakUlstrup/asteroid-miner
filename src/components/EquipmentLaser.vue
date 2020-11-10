<template>
  <div class="laser">
    <p v-if="target">
      target: {{ target.name }} x: {{ target.position.x.toFixed(1) }} y:
      {{ target.position.y.toFixed(1) }}
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
import { defineComponent, ref } from "vue";

import GameLoop from "@/GameLoop";
// import Color from "color";

// const color = Color("rgb(255, 255, 255)");
// console.log(color.rgb());
// console.log(color.darken(0.1).rgb());

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
    },
    element: {
      type: HTMLDivElement,
      required: false,
      default: undefined
    }
  },
  setup(props) {
    const isMining = ref(false);
    const targetCoords = ref({
      x: 0,
      y: 0
    });

    function update(dt: number) {
      if (props.element) {
        targetCoords.value.x = props.element.offsetLeft;
        targetCoords.value.y = props.element.offsetTop;
      }

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
      targetCoords
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
