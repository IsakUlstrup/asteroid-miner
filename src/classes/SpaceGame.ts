import RenderManager from "@/classes/RenderManager";
import Asteroid from "./Asteroid";
import CanvasObject from "./CanvasObject";
import Laser, { TargetMode } from "./Laser";
import Ship from "./Ship";

export default class SpaceGame {
  renderer: RenderManager;
  ship: Ship;
  canvasObjects: CanvasObject[] = [];
  hudObjects: CanvasObject[] = [];
  constructor(
    context: CanvasRenderingContext2D,
    resolutionScale = 1,
    ship: Ship
  ) {
    this.ship = ship;
    this.ship.setModule(
      new Laser("laser", this.canvasObjects, TargetMode.auto),
      0
    );

    this.ship.setModule(
      new Laser("laser two", this.canvasObjects, TargetMode.manual),
      1
    );

    this.renderer = new RenderManager(
      context,
      this.canvasObjects,
      this.hudObjects,
      this.ship.transfrom.z,
      resolutionScale
    );

    // generate some asteroids
    for (let index = 0; index < 10; index++) {
      this.addAsteroid();
    }
    this.hudObjects.push(this.ship);
  }
  addAsteroid() {
    const color = {
      c: Math.random() * 100,
      m: Math.random() * 100,
      y: Math.random() * 100,
      k: Math.random() * 100
    };
    this.canvasObjects.push(
      new Asteroid((Math.round(Math.random() + 2) * 4), 100, color, 0)
    );
  }
}
