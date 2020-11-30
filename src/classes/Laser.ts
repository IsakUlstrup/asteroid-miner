import Module from "@/classes/Module";
import CanvasObject from "./CanvasObject";
import CanvasWrapper from "@/classes/CanvasWrapper";

export default class Laser extends Module {
  canvasObjects: CanvasObject[];
  target: CanvasObject | undefined;
  constructor(name = "a laser", canvasObjects: CanvasObject[]) {
    super(name);
    this.canvasObjects = canvasObjects;
  }
  draw(canvas: CanvasWrapper) {
    if (this.target) {
      canvas.context.fillStyle = "rgb(255, 0, 0)";
      canvas.context.lineCap = "round";

      const perspective = 1;

      canvas.context.beginPath();
      canvas.context.lineJoin = "round";
      canvas.context.moveTo(0, canvas.size.height);
      canvas.context.lineTo(
        this.target.projected.x - perspective,
        this.target.projected.y
      );
      canvas.context.lineTo(
        this.target.projected.x + perspective,
        this.target.projected.y
      );
      canvas.context.lineTo(10, canvas.size.height);
      canvas.context.fill();
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
