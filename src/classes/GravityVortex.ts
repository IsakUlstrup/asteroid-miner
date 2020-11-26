import CursorTracker from "@/services/CursorTracker";
import Module from "./Module";
import ModuleEffect from "./ModuleEffect";

export default class Beam extends ModuleEffect {
  target: Vector3D;
  module: Module;
  constructor(module: Module, target: Vector3D, cursor: CursorTracker) {
    super(
      cursor.position,
      {
        r: 0,
        g: 0,
        b: 0
      },
      module,
      target,
      cursor
    );
    this.module = module;
    this.target = target;
  }
  draw(ctx: CanvasRenderingContext2D) {
    if (!this.visible) return;
    ctx.restore();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.arc(
      this.position.x,
      this.position.y,
      this.module.derivedStats.effect,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }
}
