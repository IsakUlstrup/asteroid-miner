// interface Listener {
//   update: (dt: number) => void;
// }

import { reactive } from 'vue';

// const state = Math.random();
// const animals = ['Panda', 'Bear', 'Eagle'];
// const state = reactive({})
const listeners: Function[] = [];
let speedModifier = 1;

let paused = false;

const timing = reactive({
  dt: 0,
  last: 0
});

function loop() {
  window.requestAnimationFrame(loop);
  const now = performance.now();
  timing.dt = now - timing.last;
  timing.last = now;

  if (paused) return;
  listeners.forEach(l => {
    l(timing.dt * speedModifier);
  });
}
loop();

export default {
  timing,
  status() {
    console.log(`Speed: ${speedModifier}, dt: ${timing.dt}, listeners: ${listeners}`);
  },
  addListener(listener: Function) {
    console.log("adding listener", listener);
    listeners.push(listener);
    // this.status();
  },
  removeListener(listener: Function) {
    console.log("removing listener", listener);
    listeners.slice(listeners.indexOf(listener), 1);
  },
  setSpeed(speed: number) {
    console.log("speed:", speed);
    speedModifier = speed;
  },
  pause(flag: boolean) {
    console.log("pause:", flag);
    paused = flag;
  }
}
