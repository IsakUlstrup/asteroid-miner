<template>
  <div class="game-container">
    <div class="hud">
      <input
        type="button"
        class="toggle-button"
        :class="{ inactive: !moduleState.engines }"
        value="ENG"
        @click="toggleEngines"
      />
      <input
        type="button"
        class="toggle-button"
        :class="{ inactive: !moduleState.lasers }"
        value="LSR"
        @click="toggleLasers"
      />
      <p>INV: {{ ship.inventory.length }}</p>
    </div>
    <canvas id="game-canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import Game from "@/classes/Game";
import ShipPlayer from "@/classes/ShipPlayer";
import Engine from "@/classes/Engine";
import Laser from "@/classes/Laser";

export default defineComponent({
  name: "Game",
  setup() {
    const ship = reactive(
      new ShipPlayer({ x: 0, y: 0 }, { r: 255, g: 255, b: 255 })
    ) as ShipPlayer;
    ship.addModule(new Engine({ x: -14, y: 0 }, ship, 0.07, 16));
    ship.addModule(new Laser({ x: 0, y: 0 }, ship));

    const moduleState = reactive({
      engines: true,
      lasers: true
    });

    onMounted(() => {
      const game = new Game("#game-canvas", ship);
      game.start();
    });
    function toggleEngines() {
      moduleState.engines = !moduleState.engines;
      ship.engines.forEach(e => {
        e.powerModifier = moduleState.engines ? 1 : 0;
      });
    }
    function toggleLasers() {
      moduleState.lasers = !moduleState.lasers;
      ship.lasers.forEach(l => {
        l.powerModifier = moduleState.lasers ? 1 : 0;
      });
    }
    return {
      ship,
      toggleEngines,
      toggleLasers,
      moduleState
    };
  }
});
</script>

<style scoped>
.game-container {
  position: relative;
  height: 100%;
}
.hud {
  position: absolute;
  width: 10%;
  min-width: 100px;
  color: white;
  padding: 1rem;
}
.hud .toggle-button {
  color: white;
  padding: 1rem;
  margin: 1rem 0;
  width: 100%;
  display: block;
  border: 1px solid white;
  background: none;
  border-radius: 0.2rem;
}
canvas {
  background: #131313 url("../assets/broken_noise.png");
}

.inactive {
  opacity: 0.5;
}
</style>
