<template>
  <div class="ship">
    <div class="equipment-slots">
      <div
        class="equipment-wrapper"
        v-for="equipment in ship.equipment"
        :key="equipment"
      >
        <component
          :is="equipment.type"
          :equipment="equipment"
          :target="target"
          :ship="ship"
        />
      </div>
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

    <!-- <h1>{{ ship.name }}</h1>
    <h3>reactors</h3>
    {{ ship.reactors }}
    <h3>equipment</h3>
    {{ ship.equipment }}
    <h1>Equipment</h1> -->

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
import Equipment from "@/classes/Equipment";
import Ship from "@/classes/Ship";
import { EquipmentType } from "../types/enums";
import GameLoop from "@/services/GameLoop";
import Asteroid from "@/classes/Asteroid";

// import LaserBeam from "@/components/LaserBeam.vue";
import Reactor from "@/components/EquipmentReactor.vue";
import Laser from "@/components/EquipmentLaser.vue";
import None from "@/components/EquipmentNone.vue";
import Engine from "@/components/EquipmentEngine.vue";
import GravityVortex from "@/components/EquipmentGravityVortex.vue";

export default defineComponent({
  name: "Ship",
  components: {
    // LaserBeam,
    Reactor,
    Laser,
    None,
    Engine,
    GravityVortex
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
    const reactor = new Equipment({
      equipmentType: EquipmentType.reactor,
      name: "A reactor",
      energyUse: 0,
      effect: 50,
      fuelUse: 0.001,
      fuelBufferSize: 100
    });

    const laser = new Equipment({
      equipmentType: EquipmentType.laser,
      name: "Laser one",
      effect: 0.001,
      energyUse: 10
    });

    const laser2 = new Equipment({
      equipmentType: EquipmentType.laser,
      name: "Laser two",
      energyUse: 20,
      effect: 0.005
    });

    const laser3 = new Equipment({
      equipmentType: EquipmentType.laser,
      name: "Laser three",
      energyUse: 30,
      effect: 0.002
    });

    const engine = new Equipment({
      equipmentType: EquipmentType.engine,
      name: "an engine",
      energyUse: 5,
      effect: 0.00001
    });

    const gravityVortex = new Equipment({
      equipmentType: EquipmentType.gravityVortex,
      name: "Gravity vortex generator",
      energyUse: 5,
      effect: 100
    });

    props.ship.setEquipment(reactor, 0);
    props.ship.setEquipment(laser, 1);
    // props.ship.setEquipment(laser2, 2);
    props.ship.setEquipment(gravityVortex, 3);
    props.ship.setEquipment(engine, 4);
    props.ship.setEquipment(laser2, 5);
    props.ship.setEquipment(laser3, 7);

    GameLoop.addListener((dt: number) => {
      props.ship.update(dt);
      // energy generation, if any equipment needs it
      // if (props.ship.chargeableEquipment.length > 0) {
      //   const energy = props.ship.generateEnergy();
      //   // energy distribution
      //   props.ship.chargeEquipment(energy);
      // }
    });

    return {
      EquipmentType,
      GameLoop
    };
  }
});
</script>

<style scoped lang="scss">
.beam-slots {
  display: flex;
  background: white;
  justify-content: space-between;
  text-align: center;
}
.ship {
  overflow-y: scroll;
  height: 100%;
  background: white;
}
.equipment-slots {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.equipment-wrapper {
  width: 15rem;
  border: 1px solid #444;
  margin: 0.5rem;
  padding: 0.5rem;
}
</style>
