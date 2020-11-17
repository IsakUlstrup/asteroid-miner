// const PERSPECTIVE = 1 * 0.6; // The field of view of our 3D scene
// const PROJECTION_CENTER_X = 1 / 2; // x center of the canvas
// const PROJECTION_CENTER_Y = 1 / 2; // y center of the canvas

export default class Asteroid {
  // position
  x: number;
  y: number;
  // z: number;
  r: number;
  // vectors
  vx: number;
  vy: number;
  // vz: number;
  vr: number;
  // projected position
  // px: number;
  // py: number;
  // ps: number;
  points: number;
  radius: number;
  bufferCanvas: HTMLCanvasElement;
  color: string;
  constructor(points: number, radius: number, color: string) {
    this.x = Math.random();
    this.y = Math.random();
    // this.z = Math.random();
    this.r = Math.random() * 360;
    this.vx = (Math.random() - 0.5) * 0.0001;
    this.vy = (Math.random() - 0.5) * 0.0001;
    // this.vz = (Math.random() - 0.5) * 0.001;
    // this.vx = 0;
    // this.vy = 0;
    // this.vz = 0;
    this.vr = (Math.random() - 0.5) * 0.1;

    // this.px = 0;
    // this.py = 0;
    // this.ps = 0;

    this.points = points;
    this.radius = radius;
    this.color = color;
    this.bufferCanvas = this.createOffscreenCanvas(this.color);
  }
  setColor(color: string) {
    this.color = color;
    this.bufferCanvas = this.createOffscreenCanvas(this.color);
  }
  // project() {
  //   // The scaleProjected will store the scale of the element based on its distance from the 'camera'
  //   this.ps = PERSPECTIVE / (PERSPECTIVE + this.z);
  //   // The xProjected is the x position on the 2D world
  //   this.px = this.x * this.ps;
  //   // The yProjected is the y position on the 2D world
  //   this.py = this.y * this.ps;
  // }
  createOffscreenCanvas(color: string) {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.radius * 2;
    offScreenCanvas.height = this.radius * 2;
    const context = offScreenCanvas.getContext("2d");
    if (context) {
      // context.fillRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);
      context.fillStyle = color;
      context.strokeStyle = color;
      context.lineWidth = 4;
      context.beginPath();
      for (let i = 0; i < this.points; i++) {
        const x =
          this.radius +
          this.radius * 0.9 * Math.cos((2 * Math.PI * i) / this.points);
        const y =
          this.radius +
          this.radius * 0.9 * Math.sin((2 * Math.PI * i) / this.points);
        context.lineTo(Math.floor(x), Math.floor(y));
      }
      context.closePath();
      // context.globalAlpha = 0.5;
      context.fill();
      // context.globalAlpha = 1;
      context.stroke();
    }
    return offScreenCanvas;
  }
  update(dt: number) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    // this.z += this.vz;
    this.r += this.vr * dt;
  }
  draw(context: CanvasRenderingContext2D, resolution: number) {
    const center = {
      x: this.x * context.canvas.width * (1 / resolution) + this.radius,
      y: this.y * context.canvas.height * (1 / resolution) + this.radius
    };
    context.save();
    // rotate
    // context.globalAlpha = Math.abs(1 - this.z / 1);
    context.translate(center.x, center.y);
    // context.scale(1 - this.z, 1 - this.z);
    context.rotate((this.r * Math.PI) / 180);
    context.translate(-center.x, -center.y);
    // draw
    context.drawImage(
      this.bufferCanvas,
      Math.floor(this.x * context.canvas.width * (1 / resolution)),
      Math.floor(this.y * context.canvas.height * (1 / resolution))
    );
    context.restore();
    // center of rotation debug
    // context.fillRect(center.x, center.y, 5, 5);}
  }
}
