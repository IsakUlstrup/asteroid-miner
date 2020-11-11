<template>
  <div id="app">
    <section class="space">
      <SpaceAsteroid
        v-for="a in asteroids"
        :key="a"
        :asteroid="a"
        @target="setTarget"
      />
    </section>
    <section>
      <Ship :target="target" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import Ship from "@/components/Ship.vue";

import SpaceAsteroid from "@/components/SpaceAsteroid.vue";
import Asteroid from "@/classes/Asteroid";
import config from "@/config";

export default defineComponent({
  name: "App",
  components: {
    Ship,
    SpaceAsteroid
  },
  setup() {
    const asteroids = new Array(config.asteroidMaxCount);
    for (let index = 0; index < asteroids.length; index++) {
      // const element = asteroids[index];
      asteroids[index] = reactive(new Asteroid());
    }

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
      target
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
    position: relative;
    flex: 2;
  }
}
</style>
