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
  targets: CanvasObject[] = [];
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
        return [object];
      }
    }
    return [];
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
    return [];
  }
  use(target: CanvasObject[], effect: number) {
    // placeholder
  }
  // utility method that let children filter targets
  filterTargets() {
    return this.canvasObjects;
  }
  update(dt: number, canvas: CanvasWrapper) {
    // remove invalid targets
    this.targets = this.targets.filter(t => {
      return this.isValidTarget(t);
    });

    const filteredTargets = this.filterTargets();

    // manual target hitscan
    if (this.targetMode === TargetMode.manual) {
      if (!canvas.cursor.active) {
        this.targets = [];
      }
      if (this.hitScanMethod === HitScanType.point) {
        this.targets = this.pointHitScan(
          canvas.cursor.position.x,
          canvas.cursor.position.y,
          filteredTargets
        );
      } else if (this.hitScanMethod === HitScanType.radius) {
        this.targets = this.radiusHitScan(
          canvas.cursor.position.x,
          canvas.cursor.position.y,
          this.effect,
          filteredTargets
        );
      }
    }

    // auto find target
    if (
      this.targets.length <= 0 &&
      this.canvasObjects.length > 0 &&
      this.targetMode === TargetMode.auto
    ) {
      const target = this.findTarget(filteredTargets);
      if (this.hitScanMethod === HitScanType.point && target) {
        this.targets = [target];
      } else if (this.hitScanMethod === HitScanType.radius && target) {
        this.targets = this.radiusHitScan(
          target.projected.x,
          target.projected.y,
          this.effect,
          filteredTargets
        );
      }
    }

    // use module if target is set
    if (this.targets.length > 0) this.use(this.targets, dt * this.effect);
  }
}
