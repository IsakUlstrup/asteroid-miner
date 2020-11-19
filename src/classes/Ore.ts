// import Color from "@/classes/Color";
import CanvasObject from "@/classes/CanvasObject";

export default class Ore extends CanvasObject {
  constructor() {
    super(
      {
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        r: Math.random()
      },
      {
        x: (Math.random() - 0.5) * 0.0001,
        y: (Math.random() - 0.5) * 0.0001,
        z: (Math.random() - 0.5) * 0.00007,
        r: (Math.random() - 0.5) * 0.1
      },
      {
        c: 100,
        m: 0,
        y: 0,
        k: 0
      }
    );
  }
}
