import trianglify from "trianglify";
import { randomInt } from "../services/Utils";
import DestroyableObject from "./DestroyableObject";
import Ore from "./Ore";
import Vector2 from "@/engine/Vector2";

export default class Asteroid extends DestroyableObject {
  constructor(transform: Vector2, color = { r: 255, g: 0, b: 0 }) {
    super(transform, 128, color);
    this.torque = (Math.random() - 0.5) * 0.0002;
    this.vector = new Vector2();
    this.mass = 4;
    this.minSpeed = 0;
    this.collisionRadius = this.radius * 0.9;

    this.inventory.push(new Ore(this.position, Ore.Type.cyan));
    this.inventory.push(new Ore(this.position, Ore.Type.magenta));
    this.inventory.push(new Ore(this.position, Ore.Type.yellow));
    this.inventory.push(new Ore(this.position, Ore.Type.black));
    this.inventory.push(new Ore(this.position, Ore.Type.white));
  }

  public destroy() {
    this.inventory.forEach(i => {
      i.position = new Vector2(
        this.position.x + (Math.random() - 0.5) * this.size,
        this.position.y + (Math.random() - 0.5) * this.size
      );
      // i.transform.x = this.transform.x + (Math.random() - 0.5) * this.size;
      // i.transform.y = this.transform.y + (Math.random() - 0.5) * this.size;
      // i.transform = this.transform;
      i.vector = this.vector;
      this.objectStore.add(i);
    });
    this.objectStore.remove(this);
  }

  public render() {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    this.color.hsv(Math.random() * 360, 100, 100);
    const width = this.size;
    const height = this.size;

    // generate a spiral using polar coordinates
    const points = [];
    const NUM_POINTS = randomInt(50, 70);
    let r = 0;
    const rStep = width / 2 / NUM_POINTS;
    let theta = 0;
    const thetaStep = (Math.PI / NUM_POINTS) * 18;
    for (let i = 0; i < NUM_POINTS; i++) {
      const x = width / 2 + r * Math.cos(theta);
      const y = height / 2 + r * Math.sin(theta);
      const point = [x, y];
      points.push(point);
      r += rStep;
      theta = (theta + thetaStep) % (2 * Math.PI);
    }

    // apply trianglify to convert the points to polygons and apply the color
    // gradient
    const pattern = trianglify({
      height,
      width,
      points,
      xColors: [
        this.color.rgbString,
        this.color.hueRotate(randomInt(50, 360)).rgbString
      ],
      colorFunction: trianglify.colorFunctions.shadows(0.15)
    });
    return pattern.toCanvas(offScreenCanvas, { scaling: false });
  }
}
