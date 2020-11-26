<template>
  <div class="equipment-wrapper">
    <component :is="module.type" :module="module" :ship="ship" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Module from "@/classes/Module";
import Ship from "@/classes/Ship";

import Reactor from "@/components/ModuleReactor.vue";
import Laser from "@/components/ModuleLaser.vue";
import None from "@/components/ModuleNone.vue";
import Engine from "@/components/ModuleEngine.vue";
import GravityVortex from "@/components/ModuleGravityVortex.vue";

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
      type: Module,
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
  border-radius: 0.3rem;
  margin: 0.5rem;
  padding: 0.5rem;
}
</style>
