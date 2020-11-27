import CursorTracker from "@/services/CursorTracker";
import { TargetMode } from "@/types/enums";
import CanvasObject from "./CanvasObject";
import Module from "./Module";

export default class ModuleEffect extends CanvasObject {
  target: Vector3D | Projected;
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
    if (this.module.targetMode === TargetMode.auto && this.module.target) {
      this.target = this.module.target.projected;
    } else {
      this.target = this.cursor.position;
    }

    if (
      this.module.state.powerModifier > 0 &&
      this.module.targetMode === TargetMode.auto &&
      this.module.target
    ) {
      this.visible = true;
    } else if (
      this.module.state.powerModifier > 0 &&
      this.module.targetMode === TargetMode.manual &&
      this.cursor.active
    ) {
      this.visible = true;
    } else {
      this.visible = false;
    }
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
