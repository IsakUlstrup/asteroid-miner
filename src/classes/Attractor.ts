import Module from "./Module";
import Ship from "./Ship";
import { distanceBetweenPoints } from "@/services/Utils";
import Ore from "./Ore";

export default class Attractor extends Module {
  range: number;
  constructor(offset: Vector2, parent: Ship) {
    super(offset, parent);
    this.range = 300;
    this.color.rgb(100, 100, 100);
  }

  get derivedRange() {
    return this.range * this.powerModifier;
  }

  moveTowardsEntity(
    currentPosition: Vector2,
    targetPosition: Vector2,
    speed: number
  ): Vector2 {
    const dx = targetPosition.x - currentPosition.x;
    const dy = targetPosition.y - currentPosition.y;
    const angle = Math.atan2(dy, dx);
    return {
      x: speed * Math.cos(angle),
      y: speed * Math.sin(angle)
    };
  }

  public update() {
    if (this.powerModifier <= 0) return;
    const ore = this.objectStore.store.filter(o => o instanceof Ore) as Ore[];
    const nearby = ore.filter(o => {
      return (
        distanceBetweenPoints(o.transform, this.parent.transform) < this.range
      );
    });

    nearby.forEach(o => {
      const speed =
        (this.derivedRange /
          distanceBetweenPoints(o.transform, this.transform)) *
        0.1;
      o.vector = this.moveTowardsEntity(o.transform, this.transform, speed);
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
