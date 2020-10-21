<template>
  <div class="station scene">
    <h1>Space station</h1>
    <p>A place for trading, crafting, fuel etc.</p>
    <h3>Ship inventory</h3>
    <ul>
      <li v-for="item in ship.inventory" :key="item">
        {{ item.name }}
        <input type="button" value="Sell" @click="sellItem(item)" />
      </li>
    </ul>
    <br />
    <input type="button" value="return to space" @click="travelToSpace" />
    <br />
    <PlayerShip :ship="ship" />
    <br />
    <input type="button" :disabled="player.credits < 10 || ship.remainingFuel >= ship.fuelCapacity" value="refuel 10 units (10 credits)" @click="refuel(10)" />
    <h3>Player</h3>
    <p>name: {{ player.name }}</p>
    <p>credits: {{ player.credits }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, toRefs, onMounted } from "vue";
import PlayerShip from "@/components/PlayerShip.vue";

import Ship from "@/classes/Ship";
import Item from "@/classes/Item";
import Player from "@/classes/Player";

export default defineComponent({
  name: "Station",
  components: {
    PlayerShip
  },
  props: {
    ship: {
      type: Ship,
      required: true
    },
    player: {
      type: Player,
      required: true
    },
    destination: String,
    dt: {
      type: Number,
      required: true,
      default: 0
    }
  },
  emits: ["arrive", "travel"],
  setup(props, context) {
    const { dt } = toRefs(props);
    function update(dt: number) {
      return dt;
    }
    watch(dt, update);

    onMounted(() => {
      props.ship.setPause(true);
      props.ship.recharge();
    });

    function refuel(amount: number) {
      props.ship.refuel(amount);
    }

    function sellItem(item: Item) {
      props.player.addCredits(100);
      props.ship.removeItem(item);
    }
    function travelToSpace() {
      props.ship.setPause(false);
      context.emit("travel", "Space");
    }

    return {
      sellItem,
      travelToSpace,
      refuel
    };
  }
});
</script>

<style lang="scss" scoped>
.station {
  padding: 5rem;
  color: white;
  background: url("../assets/bg3.jpg");
}
</style>
