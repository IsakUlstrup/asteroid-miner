import GameObject from "./GameObject";

export default class Particle extends GameObject {
  opacity: number;
  constructor(
    transform: Vector2,
    vector: Vector2,
    color = { r: 255, g: 0, b: 0 }
  ) {
    super(transform, 8, color);
    this.opacity = 1;
    this.vector = vector;
  }
  render() {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    const context = offScreenCanvas.getContext("2d") as CanvasRenderingContext2D;

    context.beginPath();
    context.arc(this.size / 2, this.size / 2, this.size / 2, 0, 2 * Math.PI);
    context.fillStyle = this.color.rgbString;
    context.fill();
    return offScreenCanvas;
  }
  public update(dt: number) {
    this.opacity -= 0.001 * dt;
    if (this.opacity < 0) this.opacity = 0;
    this.updateTransform(dt);
  }
  public draw(context: CanvasRenderingContext2D) {
    context.globalAlpha = this.opacity;
    context.drawImage(
      this.bufferCanvas,
      this.transform.x - this.size / 2,
      this.transform.y - this.size / 2
    );
    context.globalAlpha = 1;
  }
}