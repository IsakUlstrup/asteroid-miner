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
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

ul {
  list-style: none;
}

html {
  font-size: 62.5%;
}

body {
  font-size: 1.4rem;
  line-height: 2rem;
  background: #262626;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 1%;
  height: 100vh;
  background: #262626;
}
</style>
