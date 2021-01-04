import GameObject from "./GameObject";
import Particle from "./Particle";
import Vector2 from "@/engine/Vector2";

export default class ParticleEmitter extends GameObject {
  particles: Particle[];
  constructor(position: Vector2, color = { r: 255, g: 0, b: 0 }) {
    super(position, 0, color);
    this.particles = [];
  }

  public emit(
    position = this.position,
    vector: Vector2 = new Vector2(0, 0),
    color = this.color.rgbObject
  ) {
    this.particles.push(new Particle(position, vector, color));
  }
  public update(dt: number) {
    this.particles.forEach(p => {
      p.update(dt);
    });
    this.particles = this.particles.filter(p => {
      return p.opacity > 0;
    });
  }
  public draw(context: CanvasRenderingContext2D) {
    this.particles.forEach(p => {
      p.draw(context);
    });
  }
}
