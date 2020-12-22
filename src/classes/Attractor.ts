import CanvasWrapper from "@/engine/CanvasWrapper";
import GameObject from "@/engine/GameObject";
import Module from "./Module";
import Ship from "./Ship";
import {
  distanceBetweenPoints,
  radianToPoint,
  rotateVector
} from "@/services/Utils";
import Ore from "./Ore";

export default class Attractor extends Module {
  range: number;
  constructor(offset: Vector2, parent: Ship) {
    super(offset, parent);
    this.range = 300;
    this.color.rgb(255, 255, 255);
  }

  get derivedRange() {
    return this.range * this.powerModifier;
  }

  public update() {
    if (this.powerModifier <= 0) return;
    const ore = this.objectStore.store.filter(o => o instanceof Ore);
    const nearby = ore.filter(o => {
      return (
        distanceBetweenPoints(o.transform, this.parent.transform) <
        this.derivedRange
      );
    });

    nearby.forEach(o => {
      const dx = this.parent.transform.x - o.transform.x;
      const dy = this.parent.transform.y - o.transform.y;
      const angle = Math.atan2(dy, dx);
      const velocity = 1;
      const vector = {
        x: velocity * Math.cos(angle),
        y: velocity * Math.cos(angle)
      };

      o.vector = vector;
    });
  }

  public draw(context: CanvasRenderingContext2D) {
    if (this.powerModifier <= 0) return;

    context.strokeStyle = this.color.rgbString;
    context.lineWidth = 1;
    context.beginPath();
    context.arc(
      this.parent.transform.x,
      this.parent.transform.y,
      this.range,
      0,
      2 * Math.PI
    );
    context.stroke();
  }
}
