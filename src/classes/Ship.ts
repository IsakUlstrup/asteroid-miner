import DestroyableObject from "./DestroyableObject";
import Module from "./Module";
import CanvasWrapper from "../engine/CanvasWrapper";
import GameObject from "../engine/GameObject";
import RigidBody from "../engine/RigidBody";
import Engine from "@/classes/Engine";
import Laser from "@/classes/Laser";

export default class Ship extends DestroyableObject {
  modules: Module[];
  constructor(transform: Vector2, size = 64, color = { r: 255, g: 0, b: 0 }) {
    super(transform, size, color);
    this.modules = [];
  }

  get engines(): Engine[] {
    return this.modules.filter(m => m instanceof Engine) as Engine[];
  }
  get lasers(): Laser[] {
    return this.modules.filter(m => m instanceof Laser) as Laser[];
  }

  addModule(module: Module) {
    this.modules.push(module);
  }
  loot(object: RigidBody) {
    this.inventory = [...this.inventory, object];
    this.objectStore.remove(object);
  }
  public update(dt: number, canvas: CanvasWrapper, gameObjects: GameObject[]) {
    if (!this.isAlive) {
      this.destroy(gameObjects);
      return;
    }
    this.handleCollision(
      gameObjects.filter((go) => go instanceof RigidBody) as RigidBody[]
    );
    this.handleInput(canvas);
    this.modules.forEach((m) => m.update(dt, canvas, gameObjects));
    this.updateTransform(dt);
  }
}
