<template>
  <div id="app">
    <section class="space">
      <SpaceAsteroid />
      <SpaceAsteroid />
      <SpaceAsteroid />
      <SpaceAsteroid />
      <SpaceAsteroid />
      <SpaceAsteroid />
      <SpaceAsteroid />
      <SpaceAsteroid />
      <SpaceAsteroid />
    </section>
    <section>
      <Ship />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Ship from "@/components/Ship.vue";

import SpaceAsteroid from "@/components/SpaceAsteroid.vue";

export default defineComponent({
  name: "App",
  components: {
    Ship,
    SpaceAsteroid
  }
});
</script>

<style lang="scss">
@import url("../node_modules/normalize.css/normalize.css");

body {
  background: #262626;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;

  section {
    overflow: hidden;
    flex: 1;
    background: white;
  }

  .space {
    background: #262626;
  }
}
</style>
