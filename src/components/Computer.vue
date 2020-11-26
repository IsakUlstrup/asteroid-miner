<template>
  <div class="computer">
    <div class="equipment-slots">
      <ModuleWrapper
        v-for="module in ship.modules"
        :key="module"
        :module="module"
        :ship="ship"
      />
    </div>

    <h1>Inventory</h1>
    <ul>
      <li>c: {{ ship.inventory.c }}</li>
      <li>m: {{ ship.inventory.m }}</li>
      <li>y: {{ ship.inventory.y }}</li>
      <li>k: {{ ship.inventory.k }}</li>
    </ul>
    {{ ship.availableInventorySpace }}

    <div class="target" v-if="target">
      <h3>target</h3>
      <ul>
        <li>x: {{ target.projected.x.toFixed(2) }}</li>
        <li>y: {{ target.projected.y.toFixed(2) }}</li>
        <li>z: {{ target.position.z }}</li>
        <li>s: {{ target.projected.s }}</li>
      </ul>
    </div>

    <h1>Time</h1>
    <input type="button" value="pause" @click="GameLoop.pause(true)" />
    <input type="button" value="unpause" @click="GameLoop.pause(false)" />
    <input type="button" value="1x" @click="GameLoop.setSpeed(1)" />
    <input type="button" value="5x" @click="GameLoop.setSpeed(5)" />

    <h3>Powered equipment ({{ ship.poweredEquipment.length }})</h3>
    <ul>
      <li v-for="e in ship.poweredEquipment" :key="e">
        <p v-if="e">{{ e.name }} ({{ e.desiredEnergy }})</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Module from "@/classes/Module";
import Ship from "@/classes/Ship";
import { ModuleType } from "../types/enums";
import GameLoop from "@/services/GameLoop";
import Asteroid from "@/classes/Asteroid";

import ModuleWrapper from "@/components/ModuleWrapper.vue";

export default defineComponent({
  name: "Computer",
  components: {
    ModuleWrapper
  },
  props: {
    ship: {
      type: Ship,
      required: true
    },
    target: {
      type: Asteroid,
      required: false,
      default: undefined
    }
  },
  setup(props) {
    const reactor = new Module({
      moduleType: ModuleType.reactor,
      name: "A reactor",
      energyUse: 0,
      effect: 50,
      fuelUse: 0.001,
      fuelBufferSize: 100
    });

    const laser = new Module({
      moduleType: ModuleType.laser,
      name: "Laser one",
      effect: 0.001,
      energyUse: 10
    });

    const laser2 = new Module({
      moduleType: ModuleType.laser,
      name: "Laser two",
      energyUse: 20,
      effect: 0.005
    });

    const laser3 = new Module({
      moduleType: ModuleType.laser,
      name: "Laser three",
      energyUse: 30,
      effect: 0.002
    });

    const engine = new Module({
      moduleType: ModuleType.engine,
      name: "an engine",
      energyUse: 5,
      effect: 0.00001
    });

    const gravityVortex = new Module({
      moduleType: ModuleType.gravityVortex,
      name: "Gravity vortex generator",
      energyUse: 5,
      effect: 100
    });

    props.ship.setEquipment(reactor, 0);
    props.ship.setEquipment(laser, 1);
    props.ship.setEquipment(gravityVortex, 3);
    props.ship.setEquipment(engine, 4);
    props.ship.setEquipment(laser2, 5);
    props.ship.setEquipment(laser3, 7);

    return {
      ModuleType,
      GameLoop
    };
  }
});
</script>

<style scoped lang="scss">
.computer {
  overflow-y: scroll;
  height: 100%;
  background: white;
}
.equipment-slots {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
