import RenderManager from "@/classes/RenderManager";
import Asteroid from "./Asteroid";
import CanvasObject from "./CanvasObject";
import Laser, { TargetMode } from "./Laser";
import Ship from "./Ship";
import GameLoop from "@/services/GameLoop";
import config from "@/config";

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
    this.ship.vector = { x: 0, y: 0, z: 0.0001 };
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
      this.ship.transfrom,
      resolutionScale
    );

    this.hudObjects.push(this.ship);

    // start main loop
    GameLoop.setFPSLimit(config.framerateLimit || 60);
    GameLoop.addListener((dt: number) => {
      this.mainLoop(dt);
    });
  }
  mainLoop(dt: number) {
    // add new asteroids if count is below max
    if (this.canvasObjects.length < config.maxAsteroids) {
      this.addAsteroid();
    }

    this.renderer.update(dt);
    this.renderer.draw();
  }
  addAsteroid() {
    const color = {
      c: Math.random() * 100,
      m: Math.random() * 100,
      y: Math.random() * 100,
      k: Math.random() * 100
    };
    this.canvasObjects.push(
      new Asteroid(Math.round(Math.random() + 2) * 4, 50, color, this.ship.transfrom.z)
    );
  }
}
