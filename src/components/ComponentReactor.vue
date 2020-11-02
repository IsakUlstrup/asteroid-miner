<template>
  <div class="component" :class="{active: component.active}">
    <strong>{{ component.name }}</strong>
    <p>{{ component.description }}</p>

    reactor power:
    <br />
    <input
      type="range"
      name="reactor-power"
      min="0"
      max="1"
      step="0.1"
      :value="component.power"
      @input="component.setPower($event.target.value)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ShipComponent from "@/classes/ShipComponent";
import Ship from "@/classes/Ship";

export default defineComponent({
  name: "ComponentReactor",
  props: {
    component: {
      type: ShipComponent,
      required: true
    },
    ship: {
      type: Ship,
      required: true
    }
  }
});
</script>

<style scoped lang="scss" vars="{}">
.component {
  border: 1px solid rgba($color: #000000, $alpha: 0);
  padding: 1rem;
}
.active {
  border: 1px solid rgb(173, 0, 253);
}
</style>
