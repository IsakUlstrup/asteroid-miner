import CanvasObject from "@/classes/CanvasObject";
import Color from './Color';

export enum OreType {
  cyan,
  magenta,
  yellow,
  black
}

export default class Ore extends CanvasObject {
  points: number;
  amount: number;
  constructor(
    transform: Vector3,
    vector: Vector3,
    type: OreType,
    amount: number
  ) {
    let color: CMYKColor = { c: 0, m: 0, y: 0, k: 0 };
    switch (type) {
      case OreType.cyan:
        color = { c: 100, m: 0, y: 0, k: 0 };
        break;
      case OreType.magenta:
        color = { c: 0, m: 100, y: 0, k: 0 };
        break;
      case OreType.yellow:
        color = { c: 0, m: 0, y: 100, k: 0 };
        break;
      case OreType.black:
        color = { c: 0, m: 0, y: 0, k: 100 };
        break;
      default:
        break;
    }
    super(transform, vector, 10, 0, color);
    this.points =
      type === OreType.cyan
        ? 5
        : type === OreType.magenta
        ? 6
        : type === OreType.yellow
        ? 7
        : type === OreType.black
        ? 8
        : 5;
    this.amount = amount;
    this.bufferCanvas = this.render(new Color(color).rgbString());
  }
  gather(amount: number) {
    this.amount -= amount;
    if (this.amount < 0) {
      this.amount = 0;
      return 0;
    }
    return amount;
  }
  update(dt: number) {
    this.transform.x += this.vector.x * dt;
    this.transform.y += this.vector.y * dt;
    this.transform.z += this.vector.z * dt;
    // this.rotation += this.rotationVector * dt;

    this.visible = this.isOffscreen ? false : true;
    this.visible = this.amount <= 0 ? false : true;
  }
  render(color: string) {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    const context = offScreenCanvas.getContext("2d");
    if (context) {
      context.fillStyle = color;
      context.beginPath();
      for (let i = 0; i < this.points; i++) {
        const x =
          this.size / 2 +
          (this.size / 2) * 0.9 * Math.cos((2 * Math.PI * i) / this.points);
        const y =
          this.size / 2 +
          (this.size / 2) * 0.9 * Math.sin((2 * Math.PI * i) / this.points);
        context.lineTo(Math.floor(x), Math.floor(y));
      }
      context.closePath();
      context.fill();
    }
    return offScreenCanvas;
  }
}
