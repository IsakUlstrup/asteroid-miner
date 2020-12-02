import Module from "@/classes/Module";
import CanvasObject from "@/classes/CanvasObject";
import CanvasWrapper from "@/classes/CanvasWrapper";
import { isWithinCircle, circlesIntersect } from "@/services/Utils";

export enum TargetMode {
  manual,
  auto
}

export enum HitScanType {
  point,
  radius
}

export default class TargetedModule extends Module {
  targetMode: TargetMode;
  canvasObjects: CanvasObject[];
  target: CanvasObject | undefined;
  hitScanMethod: HitScanType;
  constructor(
    name: string,
    effect: number,
    targetMode: TargetMode,
    canvasObjects: CanvasObject[],
    hitScanMethod: HitScanType
  ) {
    super(name, effect);

    this.targetMode = targetMode;
    this.canvasObjects = canvasObjects;
    this.hitScanMethod = hitScanMethod;
  }

  isValidTarget(target: CanvasObject) {
    if (!target.isOffscreen && target.visible) {
      return true;
    }
    return false;
  }
  findTarget(objects: CanvasObject[]) {
    if (objects.length <= 0) return undefined;

    const validTargets = objects.filter(o => {
      return this.isValidTarget(o);
    });

    if (validTargets.length > 0) {
      return validTargets[Math.round(Math.random() * validTargets.length)];
    }
    return undefined;
  }
  pointHitScan(x: number, y: number, objects: CanvasObject[]) {
    for (let index = objects.length - 1; index >= 0; index--) {
      const object = objects[index];
      if (
        isWithinCircle(
          x,
          y,
          object.projected.x,
          object.projected.y,
          (object.size * object.scale) / 2
        )
      ) {
        return object;
      }
    }
    return undefined;
  }
  radiusHitScan(x: number, y: number, r: number, objects: CanvasObject[]) {
    const targets = objects.filter(o => {
      return circlesIntersect(
        o.projected.x,
        o.projected.y,
        o.size / 2,
        x,
        y,
        r
      );
    });
    if (targets.length > 0) return targets;
    return undefined;
  }
  use(target: CanvasObject, effect: number) {
    // placeholder
  }
  // utility method that let children filter targets
  filterTargets() {
    return this.canvasObjects;
  }
  update(dt: number, canvas: CanvasWrapper) {
    // untarget if current target is invalid
    if (this.target && !this.isValidTarget(this.target)) {
      this.target = undefined;
    }

    const filteredTargets = this.filterTargets();

    // manual target hitscan
    if (this.targetMode === TargetMode.manual) {
      if (!canvas.cursor.active) {
        this.target = undefined;
        return;
      }
      if (this.hitScanMethod === HitScanType.point) {
        this.target = this.pointHitScan(
          canvas.cursor.position.x,
          canvas.cursor.position.y,
          filteredTargets
        );
      } else if (this.hitScanMethod === HitScanType.radius) {
        const targets = this.radiusHitScan(
          canvas.cursor.position.x,
          canvas.cursor.position.y,
          10,
          filteredTargets
        );
        if (targets) this.target = targets[0];
      }
    }

    // auto find target
    if (
      !this.target &&
      this.canvasObjects.length > 0 &&
      this.targetMode === TargetMode.auto
    ) {
      this.target = this.findTarget(filteredTargets);
    }

    // use module if target is set
    if (this.target) this.use(this.target, dt * this.effect);
  }
}
