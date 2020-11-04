<template>
  <div class="ship-dashboard">
    <div class="status screen">
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
    </div>
    <!-- <h1 class="name">{{ ship.name }}</h1> -->
    <div class="status screen">
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// import SevenSegmentDisplay from "@/components/SevenSegmentDisplay.vue";
// import ShipComponent from "@/classes/ShipComponent";
// import LaserBeam from "@/components/LaserBeam.vue";

import Ship from "@/classes/Ship";
import Asteroid from "@/classes/Asteroid";
// import MiningLaser from "@/classes/MiningLaser";
// import ScreenGlare from "@/components/ScreenGlare.vue";

export default defineComponent({
  name: "ComponentLaser",
  components: {
    // ScreenGlare
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
// Lazer 84
// http://sunrise-digital.net/font.html
@font-face {
  font-family: Lazer84;
  src: url("../assets/Lazer84.ttf");
}
// BPdots
// https://www.fontspace.com/bpdots-font-f4930
@font-face {
  font-family: BPdots;
  src: url("../assets/Bpdotsunicase.otf");
}

.ship-dashboard {
  background: linear-gradient(rgb(255, 255, 255), rgb(200, 200, 200));
  // padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
// .name {
//   text-align: center;
//   font-family: Lazer84, sans-serif;
//   background: -webkit-linear-gradient(rgb(250, 193, 6), rgb(243, 11, 108));
//   -webkit-background-clip: text;
//   background-clip: text;
//   -webkit-text-fill-color: transparent;
//   font-size: 3rem;
//   padding: 1rem;
// }
.stat {
  display: flex;
  margin: 0.3rem;
}
.label {
  text-align: right;
  flex: 20rem;
  margin: 0 1rem;
}
.value {
  flex: auto;
}
.screen {
  background: #262626;
  border-radius: 0.5rem;
  padding: 1rem;
  color: white;
}
.status {
  font-family: BPdots, sans-serif;
  font-size: 1.7rem;
  text-shadow: 0 0 0.3rem white;
  display: flex;
  flex-wrap: wrap;
  margin: 1rem;
}
.inactive {
  color: #555;
  text-shadow: none;
}
</style>
