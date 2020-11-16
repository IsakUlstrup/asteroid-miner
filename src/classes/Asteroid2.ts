export default class Asteroid {
  // position
  x: number;
  y: number;
  r: number;
  // vectors
  vx: number;
  vy: number;
  vr: number;
  points: number;
  radius: number;
  bufferCanvas: HTMLCanvasElement;
  color: string;
  constructor(
    x: number,
    y: number,
    points: number,
    radius: number,
    color: string
  ) {
    this.x = x;
    this.y = y;
    this.r = Math.random() * 360;
    this.vx = (Math.random() - 0.5) * 0.001;
    this.vy = (Math.random() - 0.5) * 0.001;
    this.vr = Math.random() - 0.5;
    this.points = points;
    this.radius = radius;
    this.color = color;
    this.bufferCanvas = this.createOffscreenCanvas(this.color);
  }
  setColor(color: string) {
    this.color = color;
    this.bufferCanvas = this.createOffscreenCanvas(this.color);
  }
  createOffscreenCanvas(color: string) {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.radius * 2;
    offScreenCanvas.height = this.radius * 2;
    const context = offScreenCanvas.getContext("2d");
    if (context) {
      context.fillStyle = color;
      context.strokeStyle = color;
      context.lineWidth = 4;
      context.beginPath();
      for (let i = 0; i < this.points; i++) {
        const x =
          this.radius + this.radius * Math.cos((2 * Math.PI * i) / this.points);
        const y =
          this.radius + this.radius * Math.sin((2 * Math.PI * i) / this.points);
        context.lineTo(Math.floor(x), Math.floor(y));
      }
      context.closePath();
      context.globalAlpha = 0.5;
      context.fill();
      context.globalAlpha = 1;
      context.stroke();
    }
    return offScreenCanvas;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.r += this.vr;
  }
  draw(context: CanvasRenderingContext2D, resolution: number) {
    const center = {
      x: this.x * context.canvas.width * (1 / resolution) + this.radius,
      y: this.y * context.canvas.height * (1 / resolution) + this.radius
    };
    context.save();
    // rotate
    context.translate(center.x, center.y);
    context.rotate((this.r * Math.PI) / 180);
    context.translate(-center.x, -center.y);
    // draw
    context.drawImage(
      this.bufferCanvas,
      Math.floor(this.x * context.canvas.width * (1 / resolution)),
      Math.floor(this.y * context.canvas.height * (1 / resolution))
    );
    // center of rotation debug
    // context.fillRect(center.x, center.y, 5, 5);
    context.restore();
  }
}