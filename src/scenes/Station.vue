<template>
  <div class="station scene">
    <h1>Space station</h1>
    <p>A place for trading, crafting, fuel etc.</p>
    <h3>Ship inventory</h3>
    <ul>
      <li v-for="item in ship.inventory" :key="item">
        {{item.name}}
        <input type="button" value="Sell" @click="sellItem(item)">
      </li>
    </ul>
    <br>
    <input type="button" value="return to space" @click="travelToSpace">
    <br>
    <input type="button" value="refuel" @click="ship.refuel">
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, toRefs } from "vue";

import Ship from "@/classes/Ship";
import Item from "@/classes/Item";

export default defineComponent({
  name: "Station",
  components: {
  },
  props: {
    ship:Ship,
    destination:String,
    dt: {
      type: Number,
      required: true,
      default: 0
    }
  },
  emits: ["arrive", "travel"],
  setup(props, context) {
    const { ship, dt } = toRefs(props);
    function update(dt:number) {
      return;
    }
    watch(dt, update);

    function sellItem(item:Item) {
      console.log("selling item:", item);
      if (props.ship) props.ship.removeItem(item);
    }
    function travelToSpace() {
      context.emit("travel", "Space");
    }
    return {
      sellItem,
      travelToSpace
    };
  }
});
</script>

<style lang="scss" scoped>
.station {
  color: white;
  background: url("../assets/bg3.jpg");
}
</style>
