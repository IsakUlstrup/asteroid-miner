import RigidBody from "../engine/RigidBody";
import CanvasWrapper from "../engine/CanvasWrapper";
import Vector2 from "@/engine/Vector2";

export default class DestroyableObject extends RigidBody {
  maxHitPoints: number;
  hitPoints: number;
  inventory: RigidBody[];
  constructor(transform: Vector2, size = 64, color = { r: 255, g: 0, b: 0 }) {
    super(transform, size, color);
    this.maxHitPoints = 100;
    this.hitPoints = this.maxHitPoints;
    this.inventory = [];
  }

  get isAlive() {
    return this.hitPoints > 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public hit(damage: number, source: DestroyableObject) {
    if (!this.isAlive) return;
    this.hitPoints = this.hitPoints - damage > 0 ? this.hitPoints - damage : 0;
    // console.log("taking hit, current hp", this.hitPoints);
  }
  public destroy() {
    this.objectStore.remove(this);
    // gameObjects.splice(gameObjects.indexOf(this), 1);
  }
  public update(dt: number, canvas: CanvasWrapper) {
    if (!this.isAlive) {
      this.destroy();
      return;
    }
    if (this.isMoving)
      this.handleCollision(
        this.objectStore.store.filter(
          go => go instanceof RigidBody
        ) as RigidBody[]
      );
    this.handleInput(canvas);
    this.updateTransform(dt);
  }
}
