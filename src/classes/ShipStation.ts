import Ship from "./Ship";
import Vector2 from "@/engine/Vector2";

export default class ShipStation extends Ship {
  constructor(transform: Vector2, color = { r: 255, g: 0, b: 0 }) {
    super(transform, 256, color);
    this.mass = 100;
    this.torque = 0.0001;
  }

  render() {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    const context = offScreenCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    context.fillStyle = this.color.rgbString;
    context.strokeStyle = this.color.darken(30).rgbString;
    context.lineWidth = 20;

    // cross beams
    context.beginPath();
    context.moveTo(this.size / 2, 10);
    context.lineTo(this.size / 2, this.size - 10);
    context.stroke();

    context.beginPath();
    context.moveTo(10, this.size / 2);
    context.lineTo(this.size - 10, this.size / 2);
    context.stroke();

    // center hub
    context.beginPath();
    context.arc(this.size / 2, this.size / 2, 30, 0, Math.PI * 2);
    context.fill();

    // Create gradient
    const gradient = context.createRadialGradient(
      this.size / 2,
      this.size / 2,
      this.size / 3,
      this.size / 2,
      this.size / 2,
      this.size / 2
    );
    gradient.addColorStop(0, this.color.darken(30).rgbString);
    gradient.addColorStop(0.4, this.color.rgbString);
    gradient.addColorStop(0.6, this.color.rgbString);
    gradient.addColorStop(1, this.color.darken(30).rgbString);

    // main body/donut
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(
      this.size / 2,
      this.size / 2,
      this.size / 2,
      0,
      Math.PI * 2,
      false
    );
    context.arc(
      this.size / 2,
      this.size / 2,
      this.size / 3,
      0,
      Math.PI * 2,
      true
    );
    context.fill();

    return offScreenCanvas;
  }
}
