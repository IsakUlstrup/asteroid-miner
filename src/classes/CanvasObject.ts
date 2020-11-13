import Color, { ColorMode } from "./Color";

export default class CanvasObject {
  position: {
    x: number;
    y: number;
    z: number;
    r: number;
  };
  vector: {
    x: number;
    y: number;
    z: number;
    r: number;
  };
  color: Color;
  dimensions: {
    w: number;
    h: number;
    s: number;
  };
  constructor() {
    this.position = {
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      r: Math.random() * 360
    };

    this.vector = {
      x: (Math.random() - 0.5) * 0.00001,
      y: (Math.random() - 0.5) * 0.00001,
      z: (Math.random() - 0.5) * 0.00001,
      r: (Math.random() - 0.5) * 0.00001
    };

    this.color = new Color({
      mode: ColorMode.rgb,
      r: 0,
      g: 0,
      b: 0
    });

    this.dimensions = {
      w: (Math.random() + 1) * 50,
      h: (Math.random() + 1) * 50,
      s: 1
    };
  }
  update(dt: number, cameraPosition = 0) {
    return;
  }
  draw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, color: Color) {
    return;
  }
  get size() {
    return {
      w: this.dimensions.w * this.dimensions.s,
      h: this.dimensions.h * this.dimensions.s
    }
  }
}
