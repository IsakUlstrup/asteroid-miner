import Module from "@/classes/Module";
import CanvasObject from "./CanvasObject";
import CanvasWrapper from "@/classes/CanvasWrapper";
import Color from "@/classes/Color";
import { isWithinCircle } from "@/services/Utils";
import Asteroid from "./Asteroid";
import Ore, { OreType } from "@/classes/Ore";

export enum TargetMode {
  manual,
  auto
}

export default class Laser extends Module {
  canvasObjects: CanvasObject[];
  target: Asteroid | undefined;
  targetMode: TargetMode;
  perspective = 1;
  color: Color;
  position: number;
  constructor(
    name = "a laser",
    canvasObjects: CanvasObject[],
    targetMode: TargetMode,
    effect: number
  ) {
    super(name, effect);
    this.canvasObjects = canvasObjects;
    this.targetMode = targetMode;
    this.color = new Color({ c: 100, m: 0, y: 0, k: 0 });
    this.position = 0;
  }

  setColor(color: RGBColor | CMYKColor) {
    this.color.setColor(color);
  }
  laserTo(x: number, y: number, canvas: CanvasWrapper) {
    canvas.context.fillStyle = this.color.rgbString();
    canvas.context.lineCap = "round";
    canvas.context.beginPath();
    canvas.context.lineJoin = "round";
    canvas.context.moveTo(this.position, canvas.size.height);
    canvas.context.lineTo(x - this.perspective, y);
    canvas.context.lineTo(x + this.perspective, y);
    canvas.context.lineTo(this.position + 10, canvas.size.height);
    canvas.context.fill();
  }
  mine(target: Asteroid, effect: number) {
    const miningColor = this.color.cmyk();
    const mined = target.mine({
      c: miningColor.c * effect,
      m: miningColor.m * effect,
      y: miningColor.y * effect,
      k: miningColor.k * effect
    });

    if (mined.c > 0) {
      this.canvasObjects.push(
        this.generateOre(target.transform, target.vector, OreType.cyan)
      );
    }

    if (mined.m > 0) {
      this.canvasObjects.push(
        this.generateOre(target.transform, target.vector, OreType.magenta)
      );
    }

    if (mined.y > 0) {
      this.canvasObjects.push(
        this.generateOre(target.transform, target.vector, OreType.yellow)
      );
    }

    if (mined.k > 0) {
      this.canvasObjects.push(
        this.generateOre(target.transform, target.vector, OreType.black)
      );
    }
  }
  get asteroids() {
    return this.canvasObjects.filter(o => o instanceof Asteroid) as Asteroid[];
  }
  generateOre(transform: Vector3, vector: Vector3, type: OreType) {
    return new Ore(
      {
        x: transform.x + (Math.random() - 0.5) * 0.1,
        y: transform.y + (Math.random() - 0.5) * 0.1,
        z: transform.z
      },
      vector,
      type
    );
  }
  asteroidHitScan(x: number, y: number, asteroids: Asteroid[]) {
    for (let index = asteroids.length - 1; index >= 0; index--) {
      const asteroid = asteroids[index];
      if (
        isWithinCircle(
          x,
          y,
          asteroid.projected.x,
          asteroid.projected.y,
          (asteroid.size * asteroid.scale) / 2
        )
      ) {
        return asteroid;
      }
    }
    return undefined;
  }
  isValidTarget(target: Asteroid) {
    if (target.isOffscreen) return false;
    const targetColor = target.color.cmyk();
    const miningColor = this.color.cmyk();
    if (
      (miningColor.c > 0 && targetColor.c <= 0) ||
      (miningColor.m > 0 && targetColor.m <= 0) ||
      (miningColor.y > 0 && targetColor.y <= 0) ||
      (miningColor.k > 0 && targetColor.k <= 0)
    )
      return false;

    return true;
  }
  findTarget(targets: CanvasObject[]): Asteroid | undefined {
    if (targets.length <= 0) return undefined;

    const validTargets = this.asteroids.filter(a => {
      return this.isValidTarget(a);
    });
    if (validTargets.length > 0) {
      return validTargets[Math.round(Math.random() * validTargets.length)];
    }
    return undefined;
  }
  update(dt: number, canvas: CanvasWrapper) {
    if (this.targetMode === TargetMode.manual && canvas.cursor.active) {
      // hitscan
      const target = this.asteroidHitScan(
        canvas.cursor.position.x,
        canvas.cursor.position.y,
        this.asteroids
      );
      if (target) this.target = target;
    }

    // untarget if current target is invalid
    if (this.target && !this.isValidTarget(this.target))
      this.target = undefined;

    if (this.target) {
      this.mine(this.target, dt * this.effect);
    }

    if (
      !this.target &&
      this.canvasObjects.length > 0 &&
      this.targetMode === TargetMode.auto
    ) {
      // find target
      this.target = this.findTarget(this.canvasObjects);
    }
  }
  draw(canvas: CanvasWrapper, index: number, slotAmount: number) {
    const spacing = canvas.size.width / slotAmount;
    this.position = spacing * index;
    if (this.targetMode === TargetMode.auto && this.target) {
      this.laserTo(this.target.projected.x, this.target.projected.y, canvas);
    }
    if (this.targetMode === TargetMode.manual && canvas.cursor.active) {
      this.laserTo(canvas.cursor.position.x, canvas.cursor.position.y, canvas);
    }
  }
}
