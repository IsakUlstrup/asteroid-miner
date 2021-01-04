import GameObject from "../engine/GameObject";
import DestroyableObject from "./DestroyableObject";
import Ship from "./Ship";
import Vector2 from "@/engine/Vector2";

export default class Module extends GameObject {
  positionOffset: Vector2;
  parent: Ship;
  effect: number;
  powerModifier: number;
  active: boolean;
  constructor(offset: Vector2, parent: Ship, effect = 1, size = 16) {
    super(parent.position, size);
    this.positionOffset = offset;
    this.parent = parent;
    this.effect = effect;
    this.active = false;
    this.powerModifier = 1;
  }

  public get derivedEffect() {
    return this.effect * this.powerModifier;
  }
  public get destroyableObjects() {
    return this.objectStore.store.filter(
      o => o instanceof DestroyableObject && o !== this.parent
    ) as DestroyableObject[];
  }

  setPowerModifier(power: number) {
    this.powerModifier = power;
  }
  use() {
    return 0;
  }
}
