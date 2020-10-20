<template>
  <div class="asteroid">
    <h3>{{ asteroid.name }}</h3>
    <p>C: {{ asteroid.c.toFixed(0) }}</p>
    <p>M: {{ asteroid.m.toFixed(0) }}</p>
    <p>Y: {{ asteroid.y.toFixed(0) }}</p>
    <p>K: {{ asteroid.k.toFixed(0) }}</p>
    <p>HP: {{ asteroid.hp.toFixed(0) }}</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import Asteroid from "@/classes/Asteroid";

export default defineComponent({
  name: "AsteroidDisplay",
  props: {
    asteroid: {
      type: Asteroid,
      required: true
    }
  },
  setup(props) {

    function CMYKtoRGB (c: number, m: number, y: number, k: number){
      const result = {r:0, g:0, b:0};
  
      c = c / 100;
      m = m / 100;
      y = y / 100;
      k = k / 100;
  
      result.r = 1 - Math.min( 1, c * ( 1 - k ) + k );
      result.g = 1 - Math.min( 1, m * ( 1 - k ) + k );
      result.b = 1 - Math.min( 1, y * ( 1 - k ) + k );
  
      result.r = Math.round( result.r * 255 );
      result.g = Math.round( result.g * 255 );
      result.b = Math.round( result.b * 255 );
  
      return result;
	  }

    const color = computed(() => {
      const rgb = CMYKtoRGB(props.asteroid.c, props.asteroid.m, props.asteroid.y, props.asteroid.k);
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    });

    return {
      color
    }
  }
});
</script>

<style scoped lang="scss" vars="{ color }">
.asteroid {
  background: var(--color);
  display: inline-block;
  padding: 2rem;
  border-radius: 0.3rem;
  margin: 2rem;
}
</style>
