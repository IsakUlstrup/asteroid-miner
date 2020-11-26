<template>
  <div id="app">
    <section class="space">
      <Screen :ship="ship" @target="setTarget" />
    </section>
    <section class="computer">
      <Computer :target="target" :ship="ship" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import Computer from "@/components/Computer.vue";
import Screen from "@/components/Screen.vue";

import ShipClass from "@/classes/Ship";
import Asteroid from "@/classes/Asteroid";

export default defineComponent({
  name: "App",
  components: {
    Computer,
    Screen
    // AsteroidField
  },
  setup() {
    const ship = reactive(new ShipClass("a ship", 8));

    const target = ref<Asteroid>();

    function setTarget(t: Asteroid) {
      if (t === target.value) {
        target.value = undefined;
        return;
      }
      // set target to clicked asteroid
      target.value = t;
    }

    return {
      setTarget,
      target,
      ship
    };
  }
});
</script>

<style lang="scss">
@import url("../node_modules/normalize.css/normalize.css");

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
  color: #333;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;


  section {
    flex: 1;
    overflow: hidden;
  }

  .space {
    background: #262626;
    flex: 1;
  }
}

@media (orientation: landscape) {
  #app {
    flex-direction: row-reverse;
  }
}
@media (orientation: landscape) and (min-height: 700px) {
  #app {
    flex-direction: column;
  }
}
</style>
