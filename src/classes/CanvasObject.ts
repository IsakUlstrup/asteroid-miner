import Color from "./Color";
import { getScaledCanvasDimendsions } from "../services/Utils";

export default class CanvasObject {
  transfrom: Transform;
  vector: Transform;
  color: Color;
  projected: Transform;
  bufferCanvas: HTMLCanvasElement;
  visible = true;
  constructor(
    transfrom: Transform,
    vector: Transform,
    color: RGBColor | CMYKColor
  ) {
    this.transfrom = transfrom;
    this.vector = vector;
    this.color = new Color(color);
    this.projected = {
      x: 0,
      y: 0,
      z: 0,
      r: 0,
      s: 0
    };
    this.bufferCanvas = this.createOffscreenCanvas(this.color.rgbString());
  }
  createOffscreenCanvas(color: string) {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.transfrom.s;
    offScreenCanvas.height = this.transfrom.s;
    const context = offScreenCanvas.getContext("2d");
    if (context) {
      context.fillStyle = color;
      context.fillRect(0, 0, this.transfrom.s, this.transfrom.s);
    }
    return offScreenCanvas;
  }
  project(
    context: CanvasRenderingContext2D,
    resolutionScale: number,
    cameraPosition = 0
  ) {
    const perspective = 1;
    const canvasSize = getScaledCanvasDimendsions(
      context.canvas,
      resolutionScale
    );
    // center of canvas
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    // object position scaled to canvas resolution
    const scaledX = this.transfrom.x * canvasSize.width;
    const scaledY = this.transfrom.y * canvasSize.height;

    // set 2d coordinates and scale based on 3d position
    this.projected.s =
      perspective / (perspective + this.transfrom.z - cameraPosition);
    this.projected.x = scaledX * this.projected.s + centerX;
    this.projected.y = scaledY * this.projected.s + centerY;
  }
  update(dt: number) {
    this.transfrom.x += this.vector.x * dt;
    this.transfrom.y += this.vector.y * dt;
    this.transfrom.z += this.vector.z * dt;
    this.transfrom.r += this.vector.r * dt;
  }
  draw(
    context: CanvasRenderingContext2D,
    resolutionScale: number,
    cameraPosition: number
  ) {
    if (!this.visible) return;
    this.project(context, resolutionScale, cameraPosition);
    context.save();
    // rotate
    context.translate(
      this.projected.x + (this.transfrom.s * this.projected.s) / 2,
      this.projected.y + (this.transfrom.s * this.projected.s) / 2
    );
    context.rotate((this.transfrom.r * Math.PI) / 180);
    context.restore();
    // draw
    context.drawImage(
      this.bufferCanvas,
      Math.floor(this.projected.x - (this.transfrom.s * this.projected.s) / 2),
      Math.floor(this.projected.y - (this.transfrom.s * this.projected.s) / 2),
      this.transfrom.s * this.projected.s,
      this.transfrom.s * this.projected.s
    );
    // center of rotation debug
    // if (config.debug) {
    //   context.fillStyle = "rgb(255, 255, 255)";
    //   context.fillRect(this.projected.x - 2.5, this.projected.y - 2.5, 5, 5);
    // }
  }
  get isOffscreen() {
    if (
      this.transfrom.x < -0.5 ||
      this.transfrom.x > 0.5 ||
      this.transfrom.y < -0.5 ||
      this.transfrom.y > 0.5 ||
      this.projected.s < 0 ||
      this.projected.s > 10
    ) {
      return true;
    } else {
      return false;
    }
  }
}
