<template>
    <div class="component" :class="{active: component.active}">
      <LaserBeam v-if="target && targetCoordinates && component.power > 0 && scanning" :x2="targetCoordinates.x" :y2="targetCoordinates.y" color="white" />
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
      <p class="target-color">
        <span class="cyan">{{ targetColor.c.toFixed(0) }}</span>
        <span class="magenta">{{ targetColor.m.toFixed(0) }}</span>
        <span class="yellow">{{ targetColor.y.toFixed(0) }}</span>
        <span class="black">{{ targetColor.k.toFixed(0) }}</span>
      </p>
      <!-- scanning: {{scanning}} -->
      <p v-if="target">target: {{ target.name}} scan progress: {{ target.scanProgress.toFixed(1) }}</p>
      <br/>
      <input class="scan-button" type="button" :class="{scanning: scanning}" @click="toggleScan" :disabled="!target" value="Scan">
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

// import SevenSegmentDisplay from "@/components/SevenSegmentDisplay.vue";

import ShipComponent from "@/classes/ShipComponent";
import LaserBeam from "@/components/LaserBeam.vue";
import Ship from "@/classes/Ship";
import Asteroid from "@/classes/Asteroid";
import GameLoop from "@/classes/GameLoop";

export default defineComponent({
  name: "ComponentLaser",
  components: {
    // SevenSegmentDisplay
    LaserBeam
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
    },
    targetCoordinates: {
      type: Object,
      required: false
    }
  },
  setup(props) {
    const scanning = ref(false);
    
    function update(dt: number) {
      if (props.target && scanning.value) props.target.scan(props.component.effect);
      if (props.target && props.target.scanProgress >= 100) scanning.value = false; 
    }

    const targetColor = computed(() => {
      if (props.target && props.target.scanned) {
        return {
          c: props.target.c,
          m: props.target.m,
          y: props.target.y,
          k: props.target.k
        }
      } else {
        return {
          c: 0,
          m: 0,
          y: 0,
          k: 0
        }
      }
    });

    function toggleScan() {
      scanning.value = !scanning.value;
      if (scanning.value) {
        props.component.activate(true);
      } else {
        props.component.activate(false);
      }
    }

    GameLoop.addListener(update);

    return {
      scanning,
      toggleScan,
      targetColor
    }
  }
});
</script>

<style scoped lang="scss" vars="{}">
.component {
  padding: 1rem;
}
.scan-button {
  padding: 1rem;
  border: 1px solid black;
}
input:focus {
  // border: 1px solid black;
  outline: none;
}
.target-color {
  background: #999;
  padding: 1rem;

  span {
    padding: 0.5rem;
  }
  .cyan {
    color: cyan;
  }
  .magenta {
    color: magenta;
  }
  .yellow {
    color: yellow;
  }
  .black {
    color: black;
  }
}
.scanning {
  border: 1px solid red;
  outline: red;
}
</style>
