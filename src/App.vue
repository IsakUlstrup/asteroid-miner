<template>
  <div id="app">
    <section class="space">
      <AsteroidField :ship="ship" @target="setTarget" />
    </section>
    <section class="ship">
      <Ship :target="target" :ship="ship" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import Ship from "@/components/Ship.vue";
import AsteroidField from "@/components/AsteroidField.vue";

import ShipClass from "@/classes/Ship";

// import SpaceAsteroid from "@/components/SpaceAsteroid.vue";
import Asteroid from "@/classes/Asteroid";
import config from "@/config";
// import GameLoop from "@/GameLoop";

export default defineComponent({
  name: "App",
  components: {
    Ship,
    AsteroidField
  },
  setup() {
    const ship = reactive(new ShipClass("a ship", 5));
    const asteroids = reactive(new Array(config.asteroidMaxCount));
    for (let index = 0; index < asteroids.length; index++) {
      // const element = asteroids[index];
      asteroids[index] = new Asteroid();
    }

    // GameLoop.addListener((dt: number) => {
    //   asteroids.forEach(a => {
    //     if (a) {
    //       console.log(a, dt);
    //     }
    //   });
    // });

    const target = ref<Asteroid>();

    function setTarget(t: Asteroid) {
      // console.log(t);
      // toogle target if we click on a targeted asteroid
      if (t === target.value) {
        target.value = undefined;
        return;
      }
      // set target to clicked asteroid
      target.value = t;
    }

    return {
      asteroids,
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

html {
  font-size: 62.5%;
}

body {
  font-size: 1.4rem;
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
    flex: 2;
  }
}
</style>
