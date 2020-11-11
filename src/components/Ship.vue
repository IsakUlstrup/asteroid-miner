<template>
  <div class="beam-slots">
    <div class="beam" v-for="(s, index) in ship.equipmentSlots" :key="s">
      <LaserBeam
        v-if="ship.equipment[index].type === EquipmentType.laser && target"
        :x="target.position.x + 75"
        :y="target.position.y + 75"
      />
    </div>
  </div>
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

    <h1>{{ ship.name }}</h1>
    <h3>reactors</h3>
    {{ ship.reactors }}
    <h3>equipment</h3>
    {{ ship.equipment }}
    <h1>Equipment</h1>

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
import Asteroid from "@/classes/Asteroid";

import LaserBeam from "@/components/LaserBeam.vue";
import Reactor from "@/components/EquipmentReactor.vue";
import Laser from "@/components/EquipmentLaser.vue";
import None from "@/components/EquipmentNone.vue";
import Engine from "@/components/EquipmentEngine.vue";

export default defineComponent({
  name: "Ship",
  components: {
    LaserBeam,
    Reactor,
    Laser,
    None,
    Engine
  },
  props: {
    target: {
      type: Asteroid,
      required: false,
      default: undefined
    }
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

    const engine = new Equipment({
      equipmentType: EquipmentType.engine,
      name: "an engine",
      energyBufferSize: 50,
      energyUse: 0.01,
      effect: 0.0001
    });

    ship.setEquipment(reactor, 0);
    ship.setEquipment(laser, 1);
    ship.setEquipment(laser2, 2);
    ship.setEquipment(engine, 4);

    GameLoop.addListener((dt: number) => {
      // energy generation, if any equipment needs it
      if (ship.chargeableEquipment.length > 0) {
        const energy = ship.generateEnergy() * dt;
        // energy distribution
        ship.chargeEquipment(energy);
      }
    });

    return {
      ship,
      EquipmentType
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
}
.equipment-wrapper {
  width: 20rem;
  border: 1px solid #444;
  margin: 0.5rem;
  padding: 0.5rem;
}
</style>
