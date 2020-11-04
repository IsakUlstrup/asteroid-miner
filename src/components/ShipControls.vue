<template>
  <ul class="ship-controls">
    <!-- <ComponentShipStatus :ship="ship" />
    <ComponentDebugSpeedControl /> -->
    <ComponentWrapper
      v-for="component in ship.components"
      :key="component.name"
    >
      <li v-if="component.modelInfo.type === 'navigation'" >
        <ComponentNavigation :component="component" :ship="ship" @travel="travel" />
      </li>
      <li v-if="component.modelInfo.type === 'reactor'" >
        <ComponentReactor :component="component" :ship="ship" @travel="travel" />
      </li>
      <li v-if="component.modelInfo.type === 'cooler'" >
        <ComponentCooler :component="component" :ship="ship" @travel="travel" />
      </li>
      <li v-if="component.modelInfo.type === 'laser'" >
        <ComponentLaser :component="component" :ship="ship" @travel="travel" :target="target" :targetCoordinates="targetCoordinates" />
      </li>
      <li v-if="component.modelInfo.type === 'scanner'" >
        <ComponentScanner :component="component" :ship="ship" @travel="travel" :target="target" :targetCoordinates="targetCoordinates" />
      </li>
    </ComponentWrapper>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Ship from "@/classes/Ship";
// import MiningLaser from "@/classes/MiningLaser";
import ComponentWrapper from "@/components/ComponentWrapper.vue";
import ComponentNavigation from "@/components/ComponentNavigation.vue";
import ComponentReactor from "@/components/ComponentReactor.vue";
import ComponentCooler from "@/components/ComponentCooler.vue";
import ComponentLaser from "@/components/ComponentLaser.vue";
import ComponentScanner from "@/components/ComponentScanner.vue";
import Asteroid from "@/classes/Asteroid";
// import ComponentShipStatus from "@/components/ComponentShipStatus.vue";
// import ComponentDebugSpeedControl from "@/components/ComponentDebugSpeedControl.vue";

export default defineComponent({
  name: "ShipControls",
  components: {
    ComponentWrapper,
    ComponentNavigation,
    ComponentReactor,
    ComponentCooler,
    ComponentLaser,
    ComponentScanner,
    // ComponentShipStatus,
    // ComponentDebugSpeedControl
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
    },
    targetCoordinates: {
      type: Object,
      required: false
    }
  },
  emits: ["travel"],
  setup(props, context) {
    function travelHome() {
      context.emit("travel", "Station");
    }

    function travelToNextField() {
      context.emit("travel", "Space");
    }

    function travel(event: any) {
      // console.log(event);
      if (event === "station") {
        travelHome();
      } else if (event === "asteroidField") {
        travelToNextField();
      }
    }

    return {
      travelHome,
      travelToNextField,
      travel
    }
  }
});
</script>

<style lang="scss" scoped>
.ship-controls {
  color: #262626;
  list-style: none;
  display: flex;
  align-items: stretch;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  padding: 2rem;
}
</style>
