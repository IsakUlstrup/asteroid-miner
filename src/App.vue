<template>
  <Screen :ship="ship" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Ship from "./classes/Ship";
import Screen from "./components/Screen.vue";

export default defineComponent({
  name: "App",
  components: {
    Screen
  },
  setup() {
    const ship = new Ship();
    return {
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
body {
  height: 100vh;
  width: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 5%;
  height: 100%;
  background: #262626;
}
</style>
