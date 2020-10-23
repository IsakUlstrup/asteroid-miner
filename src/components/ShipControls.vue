<template>
  <div class="ship-controls">
  <ul>
    <ComponentShipStatus :ship="ship" />
    <ComponentWrapper
      v-for="component in ship.components"
      :key="component.name"
    >
      <li
        :class="{active: component.active}"
        v-if="component.name === 'Navigation'"
      >
        <NavigationComponent :component="component" :ship="ship" @travel="travel" />
      </li>
      <li
        class="component"
        :class="{active: component.active}"
        v-else-if="component.name !== 'Navigation'"
      >
        <strong>{{ component.name }}</strong>
        <p>{{ component.description }}</p>
        <!-- <p>active: {{ component.active }}</p> -->
        heating: {{ component.heating.toFixed(1) }}
        <br />
        energy use: {{ component.energyUse.toFixed(1) }}
        <br />
        effect: {{ component.effect.toFixed(1) }}
        <br />
        power: {{ component.power }}
        <br />
        <input
          type="range"
          name="component-efficiency"
          min="0"
          max="1"
          step="0.1"
          v-model="component.power"
        />
      </li>
    </ComponentWrapper>
    <!-- <ComponentWrapper>
      <li class="component">
        <strong>navigation</strong>
        <br />
        <input type="button" value="travel home" @click="travelHome" />
        <br />
        <strong>Engine power</strong>
        <br />
        <input
          type="range"
          name="component-efficiency"
          min="0"
          max="1"
          step="0.1"
        />
        <input type="button" value="next field" @click="travelToNextField" />
      </li>
    </ComponentWrapper> -->
  </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Ship from "@/classes/Ship";
// import MiningLaser from "@/classes/MiningLaser";
import ComponentWrapper from "@/components/ComponentWrapper.vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import ComponentShipStatus from "@/components/ComponentShipStatus.vue";

export default defineComponent({
  name: "ShipControls",
  components: {
    ComponentWrapper,
    NavigationComponent,
    ComponentShipStatus
  },
  props: {
    ship: {
      type: Ship,
      required: true
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
      console.log(event);
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
ul {
  list-style: none;
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
}
.component {
  border: 1px solid #aaa;
  padding: 1rem;
  border-radius: 0.3rem;
}
.active {
  border: 1px solid rgb(173, 0, 253);
}

// @media only screen and (max-width: 600px) {
//   ul {
//     flex-direction: column;
//     align-items: center;
//   }
// }
</style>
