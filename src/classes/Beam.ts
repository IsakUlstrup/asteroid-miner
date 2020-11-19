// import CanvasObject from "./CanvasObject";
// import Asteroid from "./Asteroid2";
import Color from "./Color";

export default class Beam {
  // target: Asteroid;
  intensity: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  constructor(
    x: number,
    y: number,
    targetX: number,
    targetY: number,
    intensity: number
  ) {
    // this.target = target;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.intensity = intensity;
  }
  draw(ctx: CanvasRenderingContext2D, color: Color) {
    // ctx.fillStyle = `rgba(255, 0, 0, ${this.intensity})`;
    ctx.fillStyle = color.rgbString();
    ctx.lineWidth = this.intensity * 5;
    ctx.lineCap = "round";

    const perspective = 1;

    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.targetX - perspective, this.targetY);
    ctx.lineTo(this.targetX + perspective, this.targetY);
    ctx.lineTo(this.x + 10, this.y);
    ctx.fill();
  }
}
