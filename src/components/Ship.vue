<template>
  <div class="ship">
    <h1>{{ ship.name }}</h1>
    <h3>reactors</h3>
    {{ ship.reactors }}
    <h3>equipment</h3>
    {{ ship.equipment }}
    <h1>Equipment</h1>

    <div class="equipment-slots">
      <div
        class="equipment-wrapper"
        v-for="equipment in ship.equipment"
        :key="equipment"
      >
        <component :is="equipment.type" :equipment="equipment" />
      </div>
    </div>
    <h3>Chargeable ({{ ship.chargeableEquipment.length }})</h3>
    <ul>
      <li v-for="e in ship.chargeableEquipment" :key="e">
        <p v-if="e">{{ e.name }} ({{ e.desiredEnergy }})</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import Equipment from "@/classes/Equipment";
import Ship from "@/classes/Ship";

import { EquipmentType } from "../types";
import GameLoop from "../GameLoop";

import Reactor from "@/components/EquipmentReactor.vue";
import Laser from "@/components/EquipmentLaser.vue";
import None from "@/components/EquipmentNone.vue";

export default defineComponent({
  name: "Ship",
  components: {
    Reactor,
    Laser,
    None
  },
  setup() {
    const ship = reactive(new Ship("a ship", 5));
    const reactor = new Equipment({
      equipmentType: EquipmentType.reactor,
      name: "A reactor",
      energyBufferSize: 0,
      energyUse: 0,
      effect: 0.001,
      fuelUse: 0.001,
      fuelBufferSize: 100
    });

    const laser = new Equipment({
      equipmentType: EquipmentType.laser,
      energyBufferSize: 50,
      name: "Laser one"
    });

    const laser2 = new Equipment({
      equipmentType: EquipmentType.laser,
      energyBufferSize: 150,
      name: "Laser two"
    });

    ship.setEquipment(reactor, 0);
    ship.setEquipment(laser, 1);
    ship.setEquipment(laser2, 2);

    GameLoop.addListener((dt: number) => {
      // energy generation, if any equipment needs it
      if (ship.chargeableEquipment.length > 0) {
        const energy = ship.generateEnergy() * dt;
        // energy distribution
        ship.chargeEquipment(energy);
      }
    });

    return {
      ship
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.equipment-slots {
  display: flex;
}
.equipment-wrapper {
  width: 20rem;
  height: 20rem;
  border: 1px solid #444;
  margin: 0.5rem;
  padding: 0.5rem;
}
</style>
