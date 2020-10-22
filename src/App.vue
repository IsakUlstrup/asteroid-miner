<template>
  <section class="current-scene">
    <component :is="currentScene" :dt="timing.dt" :ship="ship" :player="player" @travel="travelTo" @arrive="arrive" :destination="destination" />
  </section>
</template>

<script lang="ts">
import { defineComponent, shallowRef, ref, reactive } from "vue";

// scenes
import Space from "@/scenes/Space.vue";
import Station from "@/scenes/Station.vue";
import Travel from "@/scenes/Travel.vue";

import TestShip from "@/classes/TestShip";
import Player from "@/classes/Player";

export default defineComponent({
  name: "App",
  components: {
    Space,
    Station,
    Travel
  },
  setup() {
    const scenes = [Space, Station, Travel];
    const currentScene = shallowRef(scenes[0]);

    const ship = reactive(new TestShip());
    const player = reactive(new Player("Player One"));

    const timing = ref({
      dt:0,
      last:0
    });

    // main game loop
    function loop() {
      window.requestAnimationFrame(loop);
      const now = performance.now();
      timing.value.dt = now - timing.value.last;

      ship.update(timing.value.dt);

      timing.value.last = now;
    }
    loop();

    function arrive(scene:string) {
      console.log("arriving:", scene);
      switch (scene) {
        case "Station":
          currentScene.value = scenes[1];
          break;
        case "Space":
          // console.log("hei");
          currentScene.value = scenes[0];
          break;
      
        default:
          break;
      }
    }

    const destination = ref("none");

    function travelTo(location:string) {
      console.log("travelling to:", location);
      destination.value = location;
      currentScene.value = Travel;
    }

    return {
      currentScene,
      scenes,
      ship,
      arrive,
      destination,
      travelTo,
      timing,
      player
    };
  }
});
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 62.5%;
  font-family: Arial, Helvetica, sans-serif;
  background: #262626;
}

body {
  font-size: 1.4rem;
}
.current-scene {
  width: 100%;
  height: 100vh; /* Use vh as a fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
  overflow: auto;
}
</style>
