// import type GameObject from "../engine/GameObject";
import CanvasWrapper from "../engine/CanvasWrapper";
import config from "../config";
import { radianToPoint } from "../services/Utils";
import RigidBody from "../engine/RigidBody";
import Ship from "./Ship";
import Ore from "./Ore";
import Vector2 from "@/engine/Vector2";

export default class ShipPlayer extends Ship {
  accelerationModifier: number;
  constructor(transform: Vector2, color = { r: 255, g: 0, b: 0 }) {
    super(transform, 32, color);
    this.accelerationModifier = 0.1;
    this.mass = 1;
    this.minSpeed = 0.1;
    this.maxSpeed = 10;
  }

  protected render() {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    const context = offScreenCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    context.fillStyle = this.color.rgbString;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(this.size, this.size / 2);
    context.lineTo(0, this.size);
    context.lineTo(10, this.size / 2);
    context.closePath();
    context.fill();
    return offScreenCanvas;
  }
  collisionInteraction(target: RigidBody) {
    if (target instanceof Ore) {
      // pickup ore
      this.loot(target);
      return false;
    }
    return true;
  }
  handleInput(canvas: CanvasWrapper) {
    this.rotation = radianToPoint(
      canvas.size.width / 2,
      canvas.size.height / 2,
      canvas.cursor.position.x,
      canvas.cursor.position.y
    );

    if (canvas.cursor.active) {
      let engineEffect = 0;
      const throttle = {
        x: canvas.cursor.position.x / canvas.size.width - 0.5,
        y: canvas.cursor.position.y / canvas.size.height - 0.5
      };
      this.engines.forEach(e => {
        engineEffect += e.use();
      });
      const force = {
        x: throttle.x * engineEffect,
        y: throttle.y * engineEffect
      };

      this.force.x = force.x / this.mass;
      this.force.y = force.y / this.mass;
    }
  }
  public draw(context: CanvasRenderingContext2D) {
    this.modules.forEach(m => m.draw(context));
    this.rotateContext(context, this.rotation);

    context.drawImage(
      this.bufferCanvas,
      this.transform.x - this.radius,
      this.transform.y - this.radius
    );
    context.restore();
    if (config.debug) this.drawDebug(context);
  }
}
