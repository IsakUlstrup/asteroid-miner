import Module from "@/classes/Module";
import CanvasObject from "./CanvasObject";

export default class Laser extends Module {
  canvasObjects: CanvasObject[];
  target: CanvasObject | undefined;
  constructor(name = "a laser", canvasObjects: CanvasObject[]) {
    super(name);
    this.canvasObjects = canvasObjects;
  }
  draw(context: CanvasRenderingContext2D) {
    if (this.target) {
      context.lineWidth = 3;
      context.strokeStyle = "rgb(200, 200, 0)";
      context.beginPath();
      context.arc(
        this.target.projected.x,
        this.target.projected.y,
        this.target.projected.s * 100,
        0,
        2 * Math.PI
      );
      context.stroke();
    }
  }
  isValidTarget(target: CanvasObject) {
    if (target.isOffscreen) return false;
    return true;
  }
  update() {
    if (this.target && !this.isValidTarget(this.target))
      this.target = undefined;
    if (!this.target && this.canvasObjects.length > 0) {
      // find random target
      console.log("looking for target");
      this.target = this.canvasObjects[
        Math.floor(Math.random() * this.canvasObjects.length)
      ];
      console.log("target found!", this.target);
    }
  }
}
