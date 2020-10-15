<template>
  <div class="ship-display">
    <!-- {{ ship }} -->
    <h3>{{ ship.name }}</h3>
    <table>
      <tr>
        <td>Energy:</td>
        <td>{{ ship.energy.toFixed(0) }}</td>
      </tr>
      <tr>
        <td>Heat</td>
        <td>{{ ship.heat.toFixed(0) }}</td>
      </tr>
      <tr>
        <td>Total energy use</td>
        <td>{{ ship.totalEnergyUsage.toFixed(1) }}</td>
      </tr>
      <tr>
        <td>Total heating</td>
        <td>{{ ship.totalHeating.toFixed(1) }}</td>
      </tr>
    </table>
    <h3>Inventory ({{ ship.inventoryVolume}} / {{ship.inventorySize}})</h3>
    <ul class="inventory">
      <li v-for="item in ship.inventory" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, toRefs } from "vue";
import Ship from "@/classes/Ship";
import MiningLaser from "@/classes/MiningLaser";

export default defineComponent({
  name: "ShipDisplay",
  props: {
    ship: {
      type:Ship
    }
  }
});
</script>

<style scoped lang="scss">
.inventory {
  display: flex;
  list-style: none;
  flex-wrap: wrap;

  li {
    padding: 1rem;
  }
}
</style>
