import Vector2 from "@/engine/Vector2";

type HasPositionAndRotation = Constructor<{
  position: Vector2;
  rotation: number;
}>;

export default function Move<TBase extends HasPositionAndRotation>(
  Base: TBase
) {
  return class Move extends Base {
    vector = new Vector2();
    torque = 0;

    move(distance: number) {
      this.position.x += this.vector.x * distance;
      this.position.y += this.vector.y * distance;
    }

    get isMoving() {
      return Math.abs(this.vector.x) > 0 || Math.abs(this.vector.y) > 0
        ? true
        : false;
    }
    get speed() {
      return new Vector2().distanceTo(this.vector);
    }

    protected updatePosition(dt: number) {
      this.position.x += this.vector.x * dt;
      this.position.y += this.vector.y * dt;
      this.rotation += this.torque * dt;
    }
  };
}
