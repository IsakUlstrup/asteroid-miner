<template>
  <ComponentWrapper>
    <div class="ship-status">
      <h3>{{ ship.name }}</h3>
      <ul>
        <li><RadialProgress :progress="ship.energy" :color="'yellow'" :stroke="20">↯</RadialProgress></li>
        <li><RadialProgress :progress="ship.heat" :color="'orange'" :stroke="20">♨︎</RadialProgress></li>
        <li><RadialProgress :progress="ship.remainingFuel" :stroke="20">F</RadialProgress></li>
        <!-- <li><Meter :value="ship.energy" :min="0" :max="100" :color="'linear-gradient(to bottom right, yellow, orange)'">↯</Meter></li> -->
        <!-- <li>Energy: <meter id="energy" :value="ship.energy" min="0" low="25" max="100"></meter></li> -->
        <!-- <li><Meter :value="ship.heat" :min="0" :max="100" :color="'linear-gradient(to bottom right, orange, red)'">♨︎</Meter></li> -->
        <!-- <li>Heat: <meter id="heat" :value="ship.heat" min="0" high="85" max="100"></meter></li> -->
        <!-- <li><Meter :value="ship.remainingFuel" :min="0" :max="100" :color="'linear-gradient(to bottom right, olive, green)'">F</Meter></li> -->
        <!-- <li>Fuel: 
          <meter
            id="fuel"
            :value="ship.remainingFuel"
            min="0"
            :low="ship.fuelCapacity * 0.25"
            :max="ship.fuelCapacity"
          ></meter>
        </li> -->
      </ul>
      <p>Inventory ({{ ship.inventoryVolume }} / {{ ship.inventorySize }})</p>
      <ul class="inventory">
        <li class="item" v-for="item in ship.inventory" :key="item.id">
          {{ item.name }} ({{ item.quantity }})
        </li>
      </ul>
    </div>
  </ComponentWrapper>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ShipComponent from "@/classes/ShipComponent";
import ComponentWrapper from "@/components/ComponentWrapper.vue";
// import Meter from "@/components/Meter.vue";
import RadialProgress from "@/components/RadialProgress.vue";
import Ship from "@/classes/Ship";

export default defineComponent({
  name: "ComponentShipStatus",
  components: {
    ComponentWrapper,
    // Meter,
    RadialProgress
  },
  props: {
    ship: {
      type: Ship,
      required: true
    }
  },
  setup(props, context) {
    
    return {};
  }
});
</script>

<style scoped lang="scss" vars="{}">
.ship-status {
  margin: 1rem;

  ul {
    list-style: none;
    display: flex;

    li {
      margin: 1rem 0;
    }
  }
}
</style>
