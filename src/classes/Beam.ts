import CanvasObject from "./CanvasObject";
import Color from "./Color";

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
  draw(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    color: Color
  ) {
    // ctx.fillStyle = `rgba(255, 0, 0, ${this.intensity})`;
    ctx.fillStyle = color.rgbString();
    ctx.lineWidth = this.intensity * 5;
    ctx.lineCap = "round";

    const perspective = 0.5;

    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineTo(
      this.target.position.x * canvasWidth +
        this.target.size.w / 2 -
        perspective,
      this.target.position.y * canvasHeight + this.target.size.h / 2
    );
    ctx.lineTo(
      this.target.position.x * canvasWidth +
        this.target.size.w / 2 +
        perspective,
      this.target.position.y * canvasHeight + this.target.size.h / 2
    );
    ctx.lineTo(this.position.x + 10, this.position.y);
    ctx.fill();
  }
}
