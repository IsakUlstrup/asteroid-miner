import Color from "@/classes/Color";

export default class Asteroid {
  // position
  x: number;
  y: number;
  z: number;
  r: number;
  // vectors
  vx: number;
  vy: number;
  vz: number;
  vr: number;
  // projected position
  px: number;
  py: number;
  ps: number;
  points: number;
  radius: number;
  bufferCanvas: HTMLCanvasElement;
  baseColor: Color;
  color: Color;
  constructor(points: number, radius: number, color: RGBColor | CMYKColor) {
    // this.x = 0.5;
    // this.y = 0.5;
    // this.z = 0;
    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();
    this.r = Math.random() * 360;
    // this.vx = 0;
    // this.vy = 0;
    // this.vz = -0.001;
    this.vx = (Math.random() - 0.5) * 0.0001;
    this.vy = (Math.random() - 0.5) * 0.0001;
    this.vz = (Math.random() - 0.5) * 0.00007;
    this.vr = (Math.random() - 0.5) * 0.1;

    this.px = 0;
    this.py = 0;
    this.ps = 0;

    this.points = points;
    this.radius = radius;
    this.baseColor = new Color(color);
    this.color = new Color(color);
    this.bufferCanvas = this.createOffscreenCanvas(this.color.rgbString());
  }
  setColor(color: RGBColor | CMYKColor) {
    this.color.setColor(color);
    this.bufferCanvas = this.createOffscreenCanvas(this.color.rgbString());
  }
  mine(amount: number) {
    this.setColor(this.color.darken(amount));
  }
  project(context: CanvasRenderingContext2D, resolutionScale: number) {
    const perspective = 2;
    const centerX = (context.canvas.width * (1 / resolutionScale)) / 2;
    const centerY = (context.canvas.height * (1 / resolutionScale)) / 2;
    const scaledX = this.x * (context.canvas.width * (1 / resolutionScale));
    const scaledY = this.y * (context.canvas.height * (1 / resolutionScale));
    // console.log(centerX, centerY);
    // The scaleProjected will store the scale of the element based on its distance from the 'camera'
    this.ps = perspective / (perspective + this.z);
    // The xProjected is the x position on the 2D world
    this.px = scaledX + (scaledX / centerX) * this.ps;
    // The yProjected is the y position on the 2D world
    this.py = scaledY + (scaledY / centerY) * this.ps;
  }
  createOffscreenCanvas(color: string) {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.radius * 2;
    offScreenCanvas.height = this.radius * 2;
    const context = offScreenCanvas.getContext("2d");
    if (context) {
      // context.fillRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);
      context.fillStyle = color;
      context.strokeStyle = this.baseColor.rgbString();
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
    this.z += this.vz * dt;
    this.r += this.vr * dt;
  }
  draw(context: CanvasRenderingContext2D, resolutionScale: number) {
    this.project(context, resolutionScale);
    // console.clear();
    // console.log(`x: ${this.x.toFixed(2)}, px: ${this.px.toFixed(0)}, y: ${this.y}, py: ${this.py.toFixed(0)}, z: ${this.z}, ps: ${this.ps}`);
    const center = {
      x: this.px,
      y: this.py
    };
    context.save();
    // rotate
    // context.globalAlpha = this.ps;
    context.translate(center.x, center.y);
    context.rotate((this.r * Math.PI) / 180);
    context.translate(-center.x, -center.y);
    // draw
    context.drawImage(
      this.bufferCanvas,
      Math.floor(this.px - this.radius * this.ps),
      Math.floor(this.py - this.radius * this.ps),
      this.radius * 2 * this.ps,
      this.radius * 2 * this.ps
    );
    context.restore();
    // center of rotation debug
    // context.fillRect(center.x, center.y, 5, 5);
  }
}
