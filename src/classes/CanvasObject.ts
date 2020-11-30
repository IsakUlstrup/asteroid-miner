import Color from "./Color";
import CanvasWrapper from "@/classes/CanvasWrapper";

export default class CanvasObject {
  transfrom: Vector3;
  vector: Vector3;
  projected: Vector3;
  size: number;
  scale: number;
  rotation: number;
  rotationVector: number;
  color: Color;
  bufferCanvas: HTMLCanvasElement;
  visible = true;
  constructor(
    transfrom: Vector3,
    vector: Vector3,
    size: number,
    rotationVector: number,
    color: RGBColor | CMYKColor
  ) {
    this.transfrom = transfrom;
    this.vector = vector;
    this.color = new Color(color);
    this.projected = {
      x: 0,
      y: 0,
      z: 0
    };
    this.size = size;
    this.scale = 1;
    this.rotation = 0;
    this.rotationVector = rotationVector;
    this.bufferCanvas = this.render(this.color.rgbString());
  }
  render(color: string) {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size * this.scale;
    offScreenCanvas.height = this.size * this.scale;
    const context = offScreenCanvas.getContext("2d");
    if (context) {
      context.fillStyle = color;
      context.fillRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);
    }
    return offScreenCanvas;
  }
  project(canvas: CanvasWrapper, cameraPosition = 0) {
    const perspective = 1;
    // center of canvas
    const centerX = canvas.size.width / 2;
    const centerY = canvas.size.height / 2;
    // object position scaled to canvas resolution
    const scaledX = this.transfrom.x * canvas.size.width;
    const scaledY = this.transfrom.y * canvas.size.height;

    // set 2d coordinates and scale based on 3d position
    this.scale =
      perspective / (perspective + this.transfrom.z - cameraPosition);
    this.projected.x = scaledX * this.scale + centerX;
    this.projected.y = scaledY * this.scale + centerY;

    this.bufferCanvas = this.render(this.color.rgbString());
  }
  update(dt: number) {
    this.transfrom.x += this.vector.x * dt;
    this.transfrom.y += this.vector.y * dt;
    this.transfrom.z += this.vector.z * dt;
    this.rotation += this.rotationVector * dt;
  }
  draw(canvas: CanvasWrapper, cameraPosition: number) {
    if (!this.visible) return;
    this.project(canvas, cameraPosition);
    canvas.context.save();
    // rotate
    canvas.context.translate(
      this.projected.x + this.scale / 2,
      this.projected.y + this.scale / 2
    );
    canvas.context.rotate((this.rotation * Math.PI) / 180);
    canvas.context.restore();
    // draw
    canvas.context.drawImage(
      this.bufferCanvas,
      Math.round(this.projected.x - (this.size * this.scale) / 2),
      Math.round(this.projected.y - (this.size * this.scale) / 2)
    );
    // center of rotation debug
    // canvas.context.fillStyle = "rgb(255, 255, 255)";
    // canvas.context.fillRect(
    //   this.projected.x - 2.5,
    //   this.projected.y - 2.5,
    //   5,
    //   5
    // );
  }
  get isOffscreen() {
    if (
      this.transfrom.x < -0.5 ||
      this.transfrom.x > 0.5 ||
      this.transfrom.y < -0.5 ||
      this.transfrom.y > 0.5 ||
      this.scale < 0 ||
      this.scale > 10
    ) {
      return true;
    } else {
      return false;
    }
  }
}
