<template>
  <div class="gravity-vortex">
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
    <p>
      Buffer: {{ equipment.state.energy.toFixed(0) }} /
      {{ equipment.energyBufferSize }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import GameLoop from "@/services/GameLoop";
// import Color from "color";

// const color = Color("rgb(255, 255, 255)");
// console.log(color.rgb());
// console.log(color.darken(0.1).rgb());

import Equipment from "@/classes/Equipment";
import Ship from "@/classes/Ship";
// import Asteroid from "../classes/Asteroid";

// import LaserBeam from "@/components/LaserBeam.vue";

export default defineComponent({
  name: "Laser",
  components: {},
  props: {
    equipment: {
      type: Equipment,
      required: true
    },
    ship: {
      type: Ship,
      required: true
    }
  },
  setup(props) {
    function moveShip(dt: number) {
      // console.log(props.equipment.use() * dt);
      props.ship.move(props.equipment.use() * dt);
    }

    function update(dt: number) {
      moveShip(dt);
    }

    GameLoop.addListener(update);

    return {};
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
input[type="range"] {
  width: 100%;
}
</style>
