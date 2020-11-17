import CanvasObject from "./CanvasObject";
// import config from "../config";
import { ColorMode } from "./Color";

export default class Asteroid extends CanvasObject {
  name: string;
  hp: number;
  id: number;
  clicked: boolean;

  constructor(z: number) {
    super();
    this.name = `Asteroid #${((Math.random() + 1) * 100).toFixed(0)}`;
    this.hp = 100;
    this.id = Math.random();
    this.clicked = false;
    this.position.z = Math.random() + z;
    this.dimensions.s = 0;
    this.color.setColor({
      mode: ColorMode.rgb,
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255
    });
  }
  mine(power: number) {
    this.color.state.r -= power;
    if (this.color.state.r <= 0) this.color.state.r = 0;
  }
  move(x: number, y: number, z: number, r: number) {
    this.position = {
      x: this.position.x += x,
      y: this.position.y += y,
      z: this.position.z += z,
      r: this.position.r += r
    };
  }
  update(dt: number, cameraPosition = 0) {
    // position
    this.position.x += this.vector.x * dt;
    this.position.y += this.vector.y * dt;
    this.position.z += this.vector.z * dt;

    // scale
    this.dimensions.s = 1 - this.position.z + cameraPosition;
    // this.dimensions.w *= this.dimensions.s;
    // this.dimensions.h *= this.dimensions.s;
  }
  draw(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ) {
    ctx.fillStyle = `rgb(${this.color.rgb().r}, ${this.color.rgb().g}, ${
      this.color.rgb().b
    })`;
    ctx.strokeStyle = "rgb(255, 255, 255)";
    if (this.clicked) {
      ctx.lineWidth = 3;
      ctx.strokeRect(
        this.position.x * canvasWidth,
        this.position.y * canvasHeight,
        this.size.w,
        this.size.h
      );
    }
    ctx.fillRect(
      this.position.x * canvasWidth,
      this.position.y * canvasHeight,
      this.size.w,
      this.size.h
    );
  }
}
