<template>
  <div class="equipment-wrapper">
    <component :is="module.type" :equipment="module" :ship="ship" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Equipment from "@/classes/Equipment";
import Ship from "@/classes/Ship";

import Reactor from "@/components/EquipmentReactor.vue";
import Laser from "@/components/EquipmentLaser.vue";
import None from "@/components/EquipmentNone.vue";
import Engine from "@/components/EquipmentEngine.vue";
import GravityVortex from "@/components/EquipmentGravityVortex.vue";

export default defineComponent({
  name: "ModuleWrapper",
  components: {
    Reactor,
    Laser,
    None,
    Engine,
    GravityVortex
  },
  props: {
    module: {
      type: Equipment,
      required: true
    },
    ship: {
      type: Ship,
      required: true
    }
  }
});
</script>

<style scoped lang="scss">
.equipment-wrapper {
  width: 15rem;
  border: 1px solid #444;
  margin: 0.5rem;
  padding: 0.5rem;
}
</style>
