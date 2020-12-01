import Color from "./Color";
import CanvasWrapper from "@/classes/CanvasWrapper";
import config from "@/config";

export default class CanvasObject {
  id = Math.random();
  transform: Vector3;
  vector: Vector3;
  projected: Vector3;
  size: number;
  scale: number;
  rotation: number;
  rotationVector: number;
  color: Color;
  bufferCanvas: HTMLCanvasElement;
  visible = true;
  isOffscreen = false;
  constructor(
    transform: Vector3,
    vector: Vector3,
    size: number,
    rotationVector: number,
    color: RGBColor | CMYKColor
  ) {
    this.transform = transform;
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
    const scaledX = this.transform.x * canvas.size.width;
    const scaledY = this.transform.y * canvas.size.height;

    // set 2d coordinates and scale based on 3d position
    this.scale =
      perspective / (perspective + this.transform.z - cameraPosition);
    this.projected.x = Math.round(scaledX * this.scale + centerX);
    this.projected.y = Math.round(scaledY * this.scale + centerY);
  }
  update(dt: number) {
    this.transform.x += this.vector.x * dt;
    this.transform.y += this.vector.y * dt;
    this.transform.z += this.vector.z * dt;
    // this.rotation += this.rotationVector * dt;

    this.visible = this.isOffscreen ? false : true;
  }
  draw(canvas: CanvasWrapper, cameraPosition: number) {
    if (!this.visible) return;
    this.project(canvas, cameraPosition);

    // offscreen status
    if (
      this.projected.x < 0 ||
      this.projected.x > canvas.size.width ||
      this.projected.y < 0 ||
      this.projected.y > canvas.size.height ||
      this.scale < 0 ||
      this.scale > 20
    ) {
      this.isOffscreen = true;
    } else {
      this.isOffscreen = false;
    }

    // draw
    canvas.context.drawImage(
      this.bufferCanvas,
      this.projected.x - (this.size * this.scale) / 2,
      this.projected.y - (this.size * this.scale) / 2,
      this.size * this.scale,
      this.size * this.scale
    );
    // center of rotation debug
    if (config.debug) {
      canvas.context.fillStyle = "rgb(255, 255, 255)";
      canvas.context.fillRect(
        this.projected.x - 2.5,
        this.projected.y - 2.5,
        5,
        5
      );
    }
  }
}
