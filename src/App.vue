<template>
  <input v-for="scene in scenes" :key="scene" type="button" :value="scene.name" @click="currentScene = scene">
  <section class="current-scene">
    <component :is="currentScene" :ship="ship" />
  </section>
</template>

<script lang="ts">
import { defineComponent, shallowRef, reactive } from "vue";

// scenes
import Space from "@/scenes/Space.vue";
import Station from "@/scenes/Station.vue";

import TestShip from "@/classes/TestShip";

export default defineComponent({
  name: "App",
  components: {
    Space,
    Station
  },
  setup() {
    const scenes = [Space, Station];
    const currentScene = shallowRef(Space);

    const ship = reactive(new TestShip());

    return {
      currentScene,
      scenes,
      ship
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
}

body {
  font-size: 1.4rem;
}
</style>
