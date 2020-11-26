import CursorTracker from "@/services/CursorTracker";
import CanvasObject from "./CanvasObject";
import Module from "./Module";

export default class ModuleEffect extends CanvasObject {
  target: Vector3D;
  module: Module;
  cursor: CursorTracker;
  constructor(
    position: Vector3D,
    color: RGBColor | CMYKColor,
    module: Module,
    target: Vector3D,
    cursor: CursorTracker
  ) {
    super(position, { x: 0, y: 0, z: 0, r: 0 }, 10, color);
    this.module = module;
    this.target = target;
    this.cursor = cursor;
  }
  update() {
    this.visible =
      this.module.state.powerModifier > 0 && this.cursor.active ? true : false;
  }
  draw(ctx: CanvasRenderingContext2D) {
    if (!this.visible) return;
    ctx.restore();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.arc(
      this.target.x,
      this.target.y,
      this.module.derivedStats.effect,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }
}
