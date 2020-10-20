<template>
  <div class="player-ship">
    <h3>{{ ship.name }}</h3>

    <label for="energy">Energy: {{ ship.energy.toFixed(0) }}</label>
    <meter id="energy" :value="ship.energy" min="0" low="25" max="100"></meter>
    <br />
    <label for="heat">Heat: {{ ship.heat.toFixed(0) }}</label>
    <br />
    <meter id="heat" :value="ship.heat" min="0" high="85" max="100"></meter>
    <br />
    <label for="fuel">Fuel: {{ ship.remainingFuel.toFixed(0) }}</label>
    <br />
    <meter
      id="fuel"
      :value="ship.remainingFuel"
      min="0"
      :low="ship.fuelCapacity * 0.25"
      :max="ship.fuelCapacity"
    ></meter>
    <h3>Inventory ({{ ship.inventoryVolume }} / {{ ship.inventorySize }})</h3>
    <ul class="inventory">
      <li class="item" v-for="item in ship.inventory" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import ShipDisplay from "@/components/ShipDisplay.vue";
import Ship from "@/classes/Ship";

export default defineComponent({
  name: "PlayerShip",
  components: {},
  props: {
    ship: {
      type: Ship,
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
  margin: 2rem 0;
}
meter {
  width: 100%;
  height: 1rem;
}
.player-ship {
  background: #db07bf;
  color: white;
  padding: 2rem;
  border-radius: 0.5rem;
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
