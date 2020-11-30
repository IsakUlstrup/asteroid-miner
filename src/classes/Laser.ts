import Module from "@/classes/Module";
import CanvasObject from "./CanvasObject";
import CanvasWrapper from "@/classes/CanvasWrapper";

export enum TargetMode {
  manual,
  auto
}

export default class Laser extends Module {
  canvasObjects: CanvasObject[];
  target: CanvasObject | undefined;
  targetMode: TargetMode;
  perspective = 1;
  constructor(
    name = "a laser",
    canvasObjects: CanvasObject[],
    targetMode: TargetMode
  ) {
    super(name);
    this.canvasObjects = canvasObjects;
    this.targetMode = targetMode;
  }
  laserTo(x: number, y: number, canvas: CanvasWrapper) {
    canvas.context.fillStyle = "rgb(255, 0, 0)";
    canvas.context.lineCap = "round";
    canvas.context.beginPath();
    canvas.context.lineJoin = "round";
    canvas.context.moveTo(0, canvas.size.height);
    canvas.context.lineTo(x - this.perspective, y);
    canvas.context.lineTo(x + this.perspective, y);
    canvas.context.lineTo(10, canvas.size.height);
    canvas.context.fill();
  }
  draw(canvas: CanvasWrapper) {
    if (this.targetMode === TargetMode.auto && this.target) {
      this.laserTo(this.target.projected.x, this.target.projected.y, canvas);
    }
    if (this.targetMode === TargetMode.manual && canvas.cursor.active) {
      this.laserTo(canvas.cursor.position.x, canvas.cursor.position.y, canvas);
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
