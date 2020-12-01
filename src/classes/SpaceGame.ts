import RenderManager from "@/classes/RenderManager";
import Asteroid from "./Asteroid";
import CanvasObject from "./CanvasObject";
import Laser, { TargetMode } from "./Laser";
import Ship from "./Ship";
import GameLoop from "@/services/GameLoop";
import config from "@/config";
import { randomInt } from "@/services/Utils";

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
    this.ship.vector = { x: 0, y: 0, z: 0.0003 };
    this.ship.setModule(
      new Laser("laser", this.canvasObjects, TargetMode.auto),
      0
    );

    const laser2 = new Laser("laser two", this.canvasObjects, TargetMode.auto);
    const laser3 = new Laser(
      "laser three",
      this.canvasObjects,
      TargetMode.manual
    );
    const laser4 = new Laser(
      "laser three",
      this.canvasObjects,
      TargetMode.auto
    );

    laser2.setColor({ c: 0, m: 100, y: 0, k: 0 });
    laser3.setColor({ c: 0, m: 100, y: 0, k: 0 });
    laser4.setColor({ c: 0, m: 0, y: 100, k: 0 });

    this.ship.setModule(laser2, 1);
    this.ship.setModule(laser3, 2);
    this.ship.setModule(laser4, 3);

    this.renderer = new RenderManager(
      context,
      this.canvasObjects,
      this.hudObjects,
      this.ship.transform.z,
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
    if (
      this.canvasObjects.filter(o => o instanceof Asteroid).length <
      config.maxAsteroids
    ) {
      this.addAsteroid();
    }

    this.renderer.setCameraPosition(this.ship.transform.z);
    this.renderer.update(dt);
    this.renderer.draw();
  }
  addAsteroid() {
    this.canvasObjects.push(
      new Asteroid(
        randomInt(4, 9),
        30,
        {
          c: Math.random() * 100,
          m: Math.random() * 100,
          y: Math.random() * 100,
          k: Math.random() * 10
        },
        this.ship.transform.z
      )
    );
  }
}
