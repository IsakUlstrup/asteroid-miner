import DestroyableObject from "./DestroyableObject";
import Module from "./Module";
import CanvasWrapper from "../engine/CanvasWrapper";
import RigidBody from "../engine/RigidBody";
import Engine from "@/classes/Engine";
import Laser from "@/classes/Laser";
import Attractor from "./Attractor";
import Vector2 from "@/engine/Vector2";

export default class Ship extends DestroyableObject {
  modules: Module[];
  constructor(transform: Vector2, size = 64, color = { r: 255, g: 0, b: 0 }) {
    super(transform, size, color);
    this.modules = [];
    this.minSpeed = 0.1;
  }

  get engines(): Engine[] {
    return this.modules.filter(m => m instanceof Engine) as Engine[];
  }
  get lasers(): Laser[] {
    return this.modules.filter(m => m instanceof Laser) as Laser[];
  }
  get attractors(): Attractor[] {
    return this.modules.filter(m => m instanceof Attractor) as Attractor[];
  }

  addModule(module: Module) {
    this.modules.push(module);
  }
  loot(object: RigidBody) {
    this.inventory.push(object);
    this.objectStore.remove(object);
  }
  public update(dt: number, canvas: CanvasWrapper) {
    if (!this.isAlive) {
      this.destroy();
      return;
    }
    this.handleInput(canvas);
    this.handleCollision(
      this.objectStore.store.filter(
        go => go instanceof RigidBody
      ) as RigidBody[]
    );
    this.updateTransform(dt);
    this.modules.forEach(m => m.update(dt, canvas));
  }
}
