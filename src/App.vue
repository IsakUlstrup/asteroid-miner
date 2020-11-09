<template>
  <div class="space">
    <SpaceAsteroid />
    <SpaceAsteroid />
    <SpaceAsteroid />
    <SpaceAsteroid />
    <SpaceAsteroid />
    <SpaceAsteroid />
    <SpaceAsteroid />
    <SpaceAsteroid />
    <SpaceAsteroid />
  </div>
  <Ship />
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

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  // margin-top: 60px;
  width: 100%;
  height: 100vh;
}
.space {
  height: 50rem;
  overflow: hidden;
  background: #262626;
}
</style>
