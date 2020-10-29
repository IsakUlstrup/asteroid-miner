<template>
    <div class="component" :class="{active: component.active}">
      Power:<br />
        <input
          type="range"
          name="reactor-power"
          min="0"
          max="1"
          step="0.1"
          :value="component.power"
          @input="component.setPower($event.target.value)"
        />
      scanning: {{scanning}}
      <p v-if="target">target: {{ target.name}} scan progress: {{ target.scanProgress }}</p>
      <br/>
      <input type="button" :class="{scanning: scanning}" @click="toggleScan" :disabled="!target" value="Scan">
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

// import SevenSegmentDisplay from "@/components/SevenSegmentDisplay.vue";

import ShipComponent from "@/classes/ShipComponent";
import Ship from "@/classes/Ship";
import Asteroid from "@/classes/Asteroid";

export default defineComponent({
  name: "ComponentLaser",
  components: {
    // SevenSegmentDisplay
  },
  props: {
    component: {
      type: ShipComponent,
      required: true
    },
    ship: {
      type: Ship,
      required: true
    },
    target: {
      type: Asteroid,
      required: false
    }
  },
  setup(props) {
    const scanning = ref(false);

    function toggleScan() {
      scanning.value = !scanning.value;
      if (scanning.value) {
        props.component.activate(true);
        if (props.target) props.target.scan(props.component.effect);
      } else {
        props.component.activate(false);
      }
    }

    return {
      scanning,
      toggleScan
    }
  }
});
</script>

<style scoped lang="scss" vars="{}">
.component {
  padding: 1rem;
}
input {
  padding: 1rem;
  border: 1px solid black;
}
input:focus {
  // border: 1px solid black;
  outline: none;
}
.scanning {
  border: 1px solid red;
  outline: red;
}
</style>
