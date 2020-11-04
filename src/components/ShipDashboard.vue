<template>
  <div class="ship-dashboard">
    <div class="status screen">
      <DotMatrixMeter class="meter" color="cyan" :max="ship.maxEnergy" :value="ship.energy">BATT</DotMatrixMeter>
      <DotMatrixMeter class="meter" color="magenta" :max="ship.maxHeat" :value="ship.heat">TEMP</DotMatrixMeter>
      <DotMatrixMeter class="meter" color="yellow" :max="100" :value="ship.remainingFuel">FUEL</DotMatrixMeter>
    </div>
    <!-- <h1 class="name">{{ ship.name }}</h1> -->
    <!-- <div class="status screen">
      <div class="stat">
        <span class="label">Batt</span>
        <span class="value">»»»»»»»<span class="inactive">»»»</span></span>
      </div>
      <div class="stat">
        <span class="label">Temp</span>
        <span>»»»»»»»<span class="inactive">»»»</span></span>
      </div>
      <div class="stat">
        <span class="label">Fuel</span>
        <span>»»»»»»»»»<span class="inactive">»</span></span>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// import SevenSegmentDisplay from "@/components/SevenSegmentDisplay.vue";
// import ShipComponent from "@/classes/ShipComponent";
// import LaserBeam from "@/components/LaserBeam.vue";
import DotMatrixMeter from "@/components/DotMatrixMeter.vue";

import Ship from "@/classes/Ship";
import Asteroid from "@/classes/Asteroid";
// import MiningLaser from "@/classes/MiningLaser";
// import ScreenGlare from "@/components/ScreenGlare.vue";

export default defineComponent({
  name: "ComponentLaser",
  components: {
    // ScreenGlare
    DotMatrixMeter
  },
  props: {
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
    return {};
  }
});
</script>

<style scoped lang="scss" vars="{}">
.ship-dashboard {
  background: linear-gradient(rgb(255, 255, 255), rgb(200, 200, 200));
  // padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.screen {
  background: #262626;
  border-radius: 0.5rem;
  padding: 0 1rem;
  .meter {
    margin: 1rem;
  }
}
.status {
  font-size: 1.8rem;
  display: flex;
  flex-wrap: wrap;
  margin: 1rem;
}

@media only screen and (max-width: 600px) {
  .status {
    font-size: 1.3rem;
    .meter {
      margin: 0.2rem 0.4rem;
    }
  }
}
@media only screen and (orientation: landscape) and (max-width: 900px) {
  .status {
    font-size: 1.3rem;
    .meter {
      margin: 0.2rem 0.4rem;
    }
  }
}
</style>
