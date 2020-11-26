import CursorTracker from "@/services/CursorTracker";
import CanvasObject from "./CanvasObject";
import Color from "./Color";
import Module from "./Module";
import ModuleEffect from "./ModuleEffect";

export default class Beam extends ModuleEffect {
  intensity: number;
  target: Vector3D;
  module: Module;
  constructor(
    x: number,
    y: number,
    intensity: number,
    color: Color,
    module: Module,
    target: Vector3D,
    cursor: CursorTracker
  ) {
    super(
      { x: x, y: y, z: 0, r: 0 },
      {
        r: 0,
        g: 0,
        b: 0
      },
      module,
      target,
      cursor
    );
    this.color = color;
    this.module = module;
    this.target = target;
    this.intensity = intensity;
  }
  draw(ctx: CanvasRenderingContext2D) {
    if (!this.visible) return;
    // ctx.fillStyle = `rgba(255, 0, 0, ${this.intensity})`;
    ctx.restore();
    ctx.fillStyle = this.color.rgbString();
    ctx.lineWidth = this.intensity * 5;
    ctx.lineCap = "round";

    const perspective = 1;

    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineTo(this.target.x - perspective, this.target.y);
    ctx.lineTo(this.target.x + perspective, this.target.y);
    ctx.lineTo(this.position.x + 10, this.position.y);
    ctx.fill();
  }
}
