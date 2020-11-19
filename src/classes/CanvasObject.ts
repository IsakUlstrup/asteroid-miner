import Color from "./Color";
import { getScaledCanvasDimendsions } from "../services/Utils";

export default class CanvasObject {
  position: Vector3D;
  vector: Vector3D;
  color: Color;
  projected: Projected;
  bufferCanvas: HTMLCanvasElement;
  size: number;
  constructor(
    position: Vector3D,
    vector: Vector3D,
    size: number,
    color: RGBColor | CMYKColor
  ) {
    this.position = position;
    this.vector = vector;
    this.size = size;
    this.color = new Color(color);
    this.projected = {
      x: 0,
      y: 0,
      s: 0
    };
    this.bufferCanvas = this.createOffscreenCanvas(this.color.rgbString());
  }
  createOffscreenCanvas(color: string) {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    const context = offScreenCanvas.getContext("2d");
    if (context) {
      context.fillStyle = color;
      context.fillRect(0, 0, this.size, this.size);
    }
    return offScreenCanvas;
  }
  project(context: CanvasRenderingContext2D, resolutionScale: number) {
    const perspective = 2;
    const canvasSize = getScaledCanvasDimendsions(
      context.canvas,
      resolutionScale
    );
    // center of canvas
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    // object position scaled to canvas resolution
    const scaledX = this.position.x * canvasSize.width;
    const scaledY = this.position.y * canvasSize.height;

    // set 2d coordinates and scale based on 3d position
    this.projected.s = perspective / (perspective + this.position.z);
    this.projected.x = scaledX + (scaledX / centerX) * this.projected.s;
    this.projected.y = scaledY + (scaledY / centerY) * this.projected.s;
  }
  update(dt: number) {
    this.position.x += this.vector.x * dt;
    this.position.y += this.vector.y * dt;
    this.position.z += this.vector.z * dt;
    this.position.r += this.vector.r * dt;
  }
  draw(context: CanvasRenderingContext2D, resolutionScale: number) {
    this.project(context, resolutionScale);
    context.save();
    // rotate
    context.translate(this.projected.x - this.size / 2 * this.projected.s, this.projected.y - this.size / 2 * this.projected.s);
    context.rotate((this.position.r * Math.PI) / 180);
    context.translate(-this.projected.x - this.size / 2 * this.projected.s, -this.projected.y - this.size / 2 * this.projected.s);
    // draw
    context.drawImage(
      this.bufferCanvas,
      Math.floor(this.projected.x - this.size / 2 * this.projected.s),
      Math.floor(this.projected.y - this.size / 2 * this.projected.s),
      this.size * this.projected.s,
      this.size * this.projected.s
    );
    // center of rotation debug
    // context.fillStyle = "rgb(255, 255, 255)";
    // context.fillRect(this.projected.x - 2.5, this.projected.y - 2.5, 5, 5);
    context.restore();
  }
  get isOffscreen() {
    if (
      this.position.x < 0 ||
      this.position.x > 1 ||
      this.position.y < 0 ||
      this.position.y > 1 ||
      this.projected.s < 0 ||
      this.projected.s > 10
    ) {
      return true;
    } else {
      return false;
    }
  }
}
