import Module from "@/classes/Module";
import CanvasObject from "./CanvasObject";
import CanvasWrapper from "@/classes/CanvasWrapper";
import Color from "@/classes/Color";
import { isWithinCircle } from "@/services/Utils";
import Asteroid from "./Asteroid";
import Ore from "@/classes/Ore";

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
    targetMode: TargetMode
  ) {
    super(name);
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
  hitScan(x: number, y: number, asteroids: CanvasObject[]) {
    for (let index = asteroids.length - 1; index >= 0; index--) {
      const asteroid = asteroids[index] as Asteroid;
      if (
        isWithinCircle(
          x,
          y,
          asteroid.projected.x,
          asteroid.projected.y,
          (asteroid.size * asteroid.scale) / 2
        )
      ) {
        // mine if any laser is active and wehave a target
        this.target = asteroid;
        return asteroid;
      }
    }
  }
  isValidTarget(target: Asteroid) {
    if (target.isOffscreen) return false;
    const targetColor = target.color.cmyk();
    const miningColor = this.color.cmyk();
    if (
      miningColor.c > 0 && targetColor.c <= 0 ||
      miningColor.m > 0 && targetColor.m <= 0 ||
      miningColor.y > 0 && targetColor.y <= 0 ||
      miningColor.k > 0 && targetColor.k <= 0
    )
      return false;

    return true;
  }
  findTarget(targets: CanvasObject[]): Asteroid | undefined {
    if (targets.length <= 0) return undefined;

    // random target, will elaborate on this later
    const asteroids = this.canvasObjects.filter(
      o => o instanceof Asteroid
    ) as Asteroid[];
    // return asteroids[Math.floor(Math.random() * asteroids.length)];
    const validTargets = asteroids.filter(a => {
      return this.isValidTarget(a);
    });
    if (validTargets.length > 0) {
      return validTargets[0];
    } else {
      return undefined;
    }
  }
  update(dt: number) {
    // untarget if current target is invalid
    if (this.target && !this.isValidTarget(this.target))
      this.target = undefined;

    if (this.target) {
      const miningColor = this.color.cmyk();
      const mined = this.target.mine({
        c: miningColor.c * dt * 0.001,
        m: miningColor.m * dt * 0.001,
        y: miningColor.y * dt * 0.001,
        k: miningColor.k * dt * 0.001
      });

      if (mined.c <= 0 && mined.m <= 0 && mined.y <= 0 && mined.k <= 0) return;

      if (mined.c > 0) {
        const ore = new Ore(
          {
            x: this.target.transfrom.x + (Math.random() - 0.5) * 0.1,
            y: this.target.transfrom.y + (Math.random() - 0.5) * 0.1,
            z: this.target.transfrom.z
          },
          this.target.vector,
          10,
          { c: 100, m: 0, y: 0, k: 0 }
        );
        this.canvasObjects.push(ore);
      }
      if (mined.m > 0) {
        const ore = new Ore(
          {
            x: this.target.transfrom.x + (Math.random() - 0.5) * 0.1,
            y: this.target.transfrom.y + (Math.random() - 0.5) * 0.1,
            z: this.target.transfrom.z
          },
          this.target.vector,
          10,
          { c: 0, m: 100, y: 0, k: 0 }
        );
        this.canvasObjects.push(ore);
      }
      if (mined.y > 0) {
        const ore = new Ore(
          {
            x: this.target.transfrom.x + (Math.random() - 0.5) * 0.1,
            y: this.target.transfrom.y + (Math.random() - 0.5) * 0.1,
            z: this.target.transfrom.z
          },
          this.target.vector,
          10,
          { c: 0, m: 0, y: 100, k: 0 }
        );
        this.canvasObjects.push(ore);
      }
      if (mined.k > 0) {
        const ore = new Ore(
          {
            x: this.target.transfrom.x + (Math.random() - 0.5) * 0.1,
            y: this.target.transfrom.y + (Math.random() - 0.5) * 0.1,
            z: this.target.transfrom.z
          },
          this.target.vector,
          10,
          { c: 0, m: 0, y: 0, k: 100 }
        );
        this.canvasObjects.push(ore);
      }
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
}
