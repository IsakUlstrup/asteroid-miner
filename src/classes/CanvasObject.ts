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
  color: {
    r: number;
    g: number;
    b: number;
  };
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
      r: (Math.random() - 0.5) * 0.001
    };

    this.color = {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255
    };

    this.dimensions = {
      w: (Math.random() + 1) * 20,
      h: (Math.random() + 1) * 20,
      s: 1
    };
  }
  update(dt: number) {
    return;
  }
  draw(ctx: CanvasRenderingContext2D,  canvas: HTMLCanvasElement) {
    return;
  }
}
