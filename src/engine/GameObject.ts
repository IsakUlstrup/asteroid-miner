import CanvasWrapper from "./CanvasWrapper";
import { distanceBetweenPoints } from "../services/Utils";
import config from "../config";
import ObjectStore from "./GameObjectStore";
import Vector2 from "./Vector2";

import Entity from "@/engine/Entity";
import { Color, Size, Id, Position, Move } from "@/behaviours";

const Base = Color(Id(Size(Move(Position(Entity)))));

export default class GameObject extends Base {
  public objectStore: ObjectStore;
  protected bufferCanvas: HTMLCanvasElement;
  constructor(position: Vector2, size = 64, color = { r: 255, g: 0, b: 0 }) {
    super();
    this.position = position;
    this.size = Math.round(size);
    this.color.rgb(color.r, color.g, color.b);
    this.bufferCanvas = this.render();
    this.objectStore = new ObjectStore();
  }

  // METHODS
  protected render() {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    const context = offScreenCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    context.fillStyle = this.color.rgbString;
    context.lineWidth = 1;
    context.beginPath();
    context.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI);
    context.fill();

    return offScreenCanvas;
  }
  public getNearbyObjects(
    position: Vector2,
    gameObjects: GameObject[],
    limit: number
  ) {
    return gameObjects.filter(go => {
      const distance = distanceBetweenPoints(position, go.position);
      return distance < limit && go !== this;
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleInput(canvas: CanvasWrapper) {
    return;
  }
  // protected updatePosition(dt: number) {
  //   this.position.x += this.vector.x * dt;
  //   this.position.y += this.vector.y * dt;
  //   this.rotation += this.torque * dt;
  // }
  public update(dt: number, canvas: CanvasWrapper) {
    this.handleInput(canvas);
    this.updatePosition(dt);
  }
  public rotateContext(context: CanvasRenderingContext2D, radian: number) {
    // rotation
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(radian);
    context.translate(-this.position.x, -this.position.y);
  }
  public drawDebug(context: CanvasRenderingContext2D) {
    // object center
    context.beginPath();
    context.arc(this.position.x, this.position.y, 3, 0, 2 * Math.PI);
    context.strokeStyle = "rgb(250, 0, 0)";
    context.stroke();

    // vector
    context.strokeStyle = "white";
    context.lineCap = "round";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(this.position.x, this.position.y);
    context.lineTo(
      this.position.x + this.vector.x * 500,
      this.position.y + this.vector.y * 500
    );
    context.stroke();

    // size
    context.lineWidth = 1;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    context.strokeStyle = "white";
    context.stroke();
  }
  public draw(context: CanvasRenderingContext2D) {
    this.rotateContext(context, this.rotation);

    // draw buffer canvas
    context.drawImage(
      this.bufferCanvas,
      Math.round(this.position.x - this.size / 2),
      Math.round(this.position.y - this.size / 2)
    );
    context.restore();
    if (config.debug) this.drawDebug(context);
  }
}
