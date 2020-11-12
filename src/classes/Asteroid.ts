import CanvasObject from "./CanvasObject";

export default class Asteroid extends CanvasObject {
  name: string;
  hp: number;
  id: number;
  clicked: boolean;

  constructor() {
    super();
    this.name = `Asteroid #${((Math.random() + 1) * 100).toFixed(0)}`;
    this.hp = 100;
    this.id = Math.random();
    this.clicked = false;
  }
  mine(power: number) {
    this.color.r -= power;
    if (this.color.r <= 0) this.color.r = 0;
  }
  move(x: number, y: number, z: number, r: number) {
    this.position = {
      x: this.position.x += x,
      y: this.position.y += y,
      z: this.position.z += z,
      r: this.position.r += r
    };
  }
  update(dt: number) {
    this.position.x += this.vector.x * dt;
    this.position.y += this.vector.y * dt;
    this.position.z += this.vector.y * dt;
    this.position.r += this.vector.r * dt;
  }
  draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
    ctx.strokeStyle = "rgb(255, 255, 255)";
    if (this.clicked) {
      ctx.lineWidth = 1;
      ctx.strokeRect(
        this.position.x * canvas.width,
        this.position.y * canvas.height,
        this.dimensions.w,
        this.dimensions.h
      );
      ctx.fillRect(
        this.position.x * canvas.width,
        this.position.y * canvas.height,
        this.dimensions.w,
        this.dimensions.h
      );
    } else {
      ctx.fillRect(
        this.position.x * canvas.width,
        this.position.y * canvas.height,
        this.dimensions.w,
        this.dimensions.h
      );
    }
  }
}
