<template>
  <Game />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Game from "./components/Game.vue";

export default defineComponent({
  name: "App",
  components: {
    Game
  }
});
</script>

<style>
@import url("../node_modules/normalize.css/normalize.css");
* {
  margin: 0;
  box-sizing: border-box;
}
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
}
</style>
