import Module from "./Module";
import ParticleEmitter from "../engine/ParticleEmitter";
import CanvasWrapper from "../engine/CanvasWrapper";
import Ship from "./Ship";
import Vector2 from "@/engine/Vector2";

export default class Engine extends Module {
  private particleEmitter: ParticleEmitter;
  constructor(offset: Vector2, parent: Ship, effect = 1, size = 16) {
    super(offset, parent, effect, size);
    this.particleEmitter = new ParticleEmitter(this.position, {
      r: 255,
      g: 255,
      b: 255
    });
  }

  protected render() {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    const context = offScreenCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    context.fillStyle = "orange";
    context.beginPath();
    context.moveTo(this.size, 0);
    context.lineTo(this.size, this.size);
    context.lineTo(0, this.size / 2);
    context.closePath();
    context.fill();

    return offScreenCanvas;
  }
  public use() {
    const rotatedPosition = {
      x: this.size * Math.cos(this.parent.rotation + Math.PI) + this.position.x,
      y: this.size * Math.sin(this.parent.rotation + Math.PI) + this.position.y
    };

    if (this.derivedEffect > 0) {
      this.particleEmitter.emit(
        new Vector2(rotatedPosition.x, rotatedPosition.y)
      );
    }
    return this.derivedEffect;
  }
  public update(dt: number, canvas: CanvasWrapper) {
    if (canvas.cursor.active) {
      this.use();
      this.active = true;
    } else {
      this.active = false;
    }
    this.particleEmitter.update(dt);
  }
  public draw(context: CanvasRenderingContext2D) {
    this.particleEmitter.draw(context);

    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.parent.rotation);
    context.translate(-this.position.x, -this.position.y);
    if (this.active && this.powerModifier > 0) {
      context.drawImage(
        this.bufferCanvas,
        this.position.x + this.positionOffset.x - this.size / 2,
        this.position.y + this.positionOffset.y - this.size / 2
      );
    }
    context.restore();
  }
}
