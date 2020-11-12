import CanvasObject from "./CanvasObject";

export default class Beam extends CanvasObject {
  target: CanvasObject;
  intensity: number;
  constructor(x: number, y: number, target: CanvasObject, intensity: number) {
    super();
    this.target = target;
    this.position.x = x;
    this.position.y = y;
    this.intensity = intensity;
  }
  draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.strokeStyle = `rgba(255, 0, 0, ${this.intensity})`;
    ctx.lineWidth = this.intensity * 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineTo(
      this.target.position.x * canvas.width + this.target.size.w / 2,
      this.target.position.y * canvas.height + this.target.size.h / 2
    );
    ctx.closePath();
    ctx.stroke();
  }
}
