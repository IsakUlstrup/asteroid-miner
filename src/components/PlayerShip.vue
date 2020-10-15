<template>
  <div class="player-ship">
    <h3>{{ ship.name }}</h3>

    <label for="energy">Energy: {{ ship.energy.toFixed(0) }}</label>
    <br>
    <meter id="energy" :value="ship.energy" min="0" low="25" max="100"></meter><br>

    <br>

    <label for="heat">Heat: {{ ship.heat.toFixed(0) }}</label>
    <br>
    <meter id="heat" :value="ship.heat" min="0" high="85" max="100"></meter><br>

    <!-- <table>
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
    </table> -->
    <h3>Inventory ({{ ship.inventoryVolume}} / {{ship.inventorySize}})</h3>
    <ul class="inventory">
      <li class="item" v-for="item in ship.inventory" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, toRefs, reactive } from "vue";
// import ShipDisplay from "@/components/ShipDisplay.vue";
import Ship from "@/classes/Ship";


export default defineComponent({
  name: "PlayerShip",
  components: {
  },
  props: {
    dt: {
      type:Number,
      default:0
    },
    ship: {
      type:Ship,
      required: true
    }
  }
});
</script>

<style scoped lang="scss">
ul {
  list-style: none;
}
li {
  margin: 3rem 0;
}
meter {
  width: 100%;
  height: 3rem;
}
.player-ship {
  background: #db07bf;
  color: white;
  padding: 2rem;
  border-radius: .5rem;
  display: inline-block;
}
.inventory {
  display: flex;
  flex-wrap: wrap;

  .item {
    border: 1px solid black;
    padding: 1rem;
    margin-right: 1rem;
  }
}
</style>
