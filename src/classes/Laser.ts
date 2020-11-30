import Module from "@/classes/Module";
import CanvasObject from "./CanvasObject";
import CanvasWrapper from "@/classes/CanvasWrapper";
import Color from "@/classes/Color";
import { isWithinCircle } from "@/services/Utils";

export enum TargetMode {
  manual,
  auto
}

export default class Laser extends Module {
  canvasObjects: CanvasObject[];
  target: CanvasObject | undefined;
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
    this.color = new Color({ r: 255, g: 0, b: 0 });
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
        // mine if any laser is active and wehave a target
        this.target = asteroid;
        return asteroid;
      }
    }
  }
  isValidTarget(target: CanvasObject) {
    if (target.isOffscreen) return false;
    return true;
  }
  findTarget(targets: CanvasObject[]) {
    if (targets.length <= 0) return undefined;

    // random target, will elaborate on this later
    return targets[Math.floor(Math.random() * this.canvasObjects.length)];
  }
  update() {
    if (this.target && !this.isValidTarget(this.target))
      this.target = undefined;
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
