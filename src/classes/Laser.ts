import Module from "@/classes/Module";
import CanvasObject from "./CanvasObject";
import { getScaledCanvasDimendsions } from "@/services/Utils";

export default class Laser extends Module {
  canvasObjects: CanvasObject[];
  target: CanvasObject | undefined;
  constructor(name = "a laser", canvasObjects: CanvasObject[]) {
    super(name);
    this.canvasObjects = canvasObjects;
  }
  draw(context: CanvasRenderingContext2D, resolutionScale: number) {
    if (this.target) {
      context.fillStyle = "rgb(255, 0, 0)";
      // context.lineWidth = this.intensity * 5;
      context.lineCap = "round";
      const canvasSize = getScaledCanvasDimendsions(
        context.canvas,
        resolutionScale
      );

      const perspective = 1;

      context.beginPath();
      context.lineJoin = "round";
      context.moveTo(0, canvasSize.height);
      context.lineTo(
        this.target.projected.x - perspective,
        this.target.projected.y
      );
      context.lineTo(
        this.target.projected.x + perspective,
        this.target.projected.y
      );
      context.lineTo(10, canvasSize.height);
      context.fill();
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
    if (!this.target && this.canvasObjects.length > 0) {
      // find target
      this.target = this.findTarget(this.canvasObjects);
    }
  }
}
