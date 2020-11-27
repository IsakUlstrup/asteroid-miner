import Ship from "@/classes/Ship";
import CanvasObject from "./CanvasObject";
import Asteroid from "@/classes/Asteroid";
import Ore from "@/classes/Ore";
import {
  randomInt,
  isWithinCircle,
  getScaledCanvasDimendsions,
  getPointInCircle,
  circlesIntersect
} from "@/services/Utils";
import config from "@/config";
import CursorTracker from "@/services/CursorTracker";
import { ModuleType, OreType, TargetMode } from "@/types/enums";
import Beam from "@/classes/Beam";
import GameLoop from "@/services/GameLoop";
import GravityVortex from "./GravityVortex";

export default class SpaceGame {
  ship: Ship;
  context: CanvasRenderingContext2D;
  gameObjects: CanvasObject[] = [];
  moduleEffects: CanvasObject[] = [];
  target: Asteroid | undefined;
  cursor: CursorTracker;
  resolutionScale: number;
  constructor(
    context: CanvasRenderingContext2D,
    ship: Ship,
    resolutionScale: number
  ) {
    this.ship = ship;
    this.context = context;
    this.cursor = new CursorTracker(this.context.canvas);
    this.resolutionScale = resolutionScale;
  }
  start() {
    this.updateModules();
    GameLoop.addListener((dt: number) => {
      this.update(dt);
      this.draw(this.context, this.ship.position);
    });
  }
  addAsteroid(canvasObjects: CanvasObject[]) {
    const radius = 50;
    canvasObjects.push(
      new Asteroid(
        randomInt(4, 9),
        radius,
        {
          c: Math.random() * 100,
          m: Math.random() * 100,
          y: Math.random() * 100,
          k: Math.random() * 10
        },
        this.ship.position
      )
    );
  }
  setResolutionScale(scale: number) {
    this.resolutionScale = scale;
  }
  generateOre(source: Asteroid, type: OreType, amount: number) {
    if (amount <= 0) return;
    const randomPosition = getPointInCircle(Math.random() * 0.1);
    const position = {
      x: source.position.x + randomPosition.x,
      y: source.position.y + randomPosition.y,
      z: source.position.z,
      r: Math.random() * 360
    };
    this.gameObjects.push(new Ore(position, source.vector, type, amount));
  }
  removeGameObject(object: CanvasObject) {
    this.gameObjects.splice(this.gameObjects.indexOf(object), 1);
  }
  getAsteroids() {
    return this.gameObjects.filter(o => o instanceof Asteroid);
  }
  getOre() {
    return this.gameObjects.filter(o => o instanceof Ore);
  }
  asteroidHitScan(x: number, y: number, asteroids: Asteroid[]) {
    // hit scan, loop asteroids backwards to find frontmost asteroid first
    for (let index = asteroids.length - 1; index >= 0; index--) {
      const asteroid = asteroids[index];
      if (
        isWithinCircle(
          x,
          y,
          asteroid.projected.x,
          asteroid.projected.y,
          (asteroid.size * asteroid.projected.s) / 2
        )
      ) {
        // mine if any laser is active and wehave a target
        this.target = asteroid;
        return asteroid;
      }
    }
    // context.emit("target", target);
  }
  oreHitscan(ore: Ore, x: number, y: number, r: number) {
    return circlesIntersect(
      ore.projected.x,
      ore.projected.y,
      ore.size / 2,
      x,
      y,
      r
    );
  }
  mineAsteroid(asteroid: Asteroid, ship: Ship, dt: number) {
    ship.modules.forEach(module => {
      if (module.type === ModuleType.laser && module.state.powerModifier > 0) {
        const moduleEffect = module.use() * dt;
        const mined = asteroid.mine({
          c: module.color.cmyk().c * moduleEffect,
          m: module.color.cmyk().m * moduleEffect,
          y: module.color.cmyk().y * moduleEffect,
          k: module.color.cmyk().k * moduleEffect
        });
        this.generateOre(asteroid, OreType.cyan, mined.c);
        this.generateOre(asteroid, OreType.magenta, mined.m);
        this.generateOre(asteroid, OreType.yellow, mined.y);
        this.generateOre(asteroid, OreType.black, mined.k);
      }
    });
  }
  getRandomAsteroid(asteroids: Asteroid[]) {
    return asteroids[Math.floor(Math.random() * asteroids.length)];
  }
  updateModules() {
    const canvasSize = getScaledCanvasDimendsions(
      this.context.canvas,
      this.resolutionScale
    );
    const spacing = canvasSize.width / this.ship.modules.length;
    this.moduleEffects = [];

    for (let index = 0; index < this.ship.modules.length; index++) {
      const module = this.ship.modules[index];
      switch (module.type) {
        case ModuleType.laser:
          this.moduleEffects.push(
            new Beam(
              spacing * index,
              canvasSize.height,
              1,
              module.color,
              module,
              this.cursor.position,
              this.cursor
            )
          );
          break;
        case ModuleType.gravityVortex:
          this.moduleEffects.push(
            new GravityVortex(module, this.cursor.position, this.cursor)
          );
          break;

        default:
          break;
      }
    }
  }
  update(dt: number) {
    // update ship
    this.ship.update(dt);
    // add new asteroids if current amount is below max
    if (this.getAsteroids().length < config.asteroidMaxCount) {
      this.addAsteroid(this.gameObjects);
    }
    // update canvas objects
    this.gameObjects.forEach(o => {
      o.update(dt);
      if (o.isOffscreen) {
        this.removeGameObject(o);
      }
    });

    // targeting
    this.ship.modules.forEach(m => {
      if (m.targetMode === TargetMode.auto) {
        // radnom target
        if (!m.target)
          m.target = this.getRandomAsteroid(this.getAsteroids() as Asteroid[]);

        if (m.target instanceof Asteroid) {
          const moduleEffect = m.use() * dt;
          const mined = m.target.mine({
            c: m.color.cmyk().c * moduleEffect,
            m: m.color.cmyk().m * moduleEffect,
            y: m.color.cmyk().y * moduleEffect,
            k: m.color.cmyk().k * moduleEffect
          });
          this.generateOre(m.target, OreType.cyan, mined.c);
          this.generateOre(m.target, OreType.magenta, mined.m);
          this.generateOre(m.target, OreType.yellow, mined.y);
          this.generateOre(m.target, OreType.black, mined.k);
        }
      } else {
        m.target = undefined;
      }
    });

    // module visual effects
    this.moduleEffects.forEach(me => {
      me.update(dt);
    });

    // sort gameobjects based on z-position
    this.gameObjects.sort((o1, o2) => {
      return o1.projected.s - o2.projected.s;
    });

    // asteroid hitscan and mining
    if (this.cursor.active) {
      const target = this.asteroidHitScan(
        this.cursor.position.x,
        this.cursor.position.y,
        this.getAsteroids() as Asteroid[]
      );

      if (target) {
        this.mineAsteroid(target, this.ship, dt);
      }
    }

    // gravity vortex
    for (let index = this.getOre().length - 1; index >= 0; index--) {
      const o = this.getOre()[index] as Ore;
      if (this.cursor.active) {
        this.ship.modules.forEach(module => {
          if (
            module.type === ModuleType.gravityVortex &&
            module.state.powerModifier > 0
          ) {
            const moduleeffect = module.use();
            if (
              circlesIntersect(
                o.projected.x,
                o.projected.y,
                o.size / 2,
                this.cursor.position.x,
                this.cursor.position.y,
                moduleeffect
              )
            ) {
              // loot ore and remove it from scene
              if (this.ship.lootOre(o.type, o.amount)) {
                this.removeGameObject(o);
              }
            }
          }
        });
      }
    }
  }

  draw(context: CanvasRenderingContext2D, cameraPosition: number) {
    const canvasSize = getScaledCanvasDimendsions(
      context.canvas,
      this.resolutionScale
    );
    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    context.imageSmoothingEnabled = false;
    context.save();
    // draw gameobjects
    [...this.gameObjects, ...this.moduleEffects].forEach(o => {
      context.restore();
      o.draw(context, this.resolutionScale, cameraPosition);
    });
  }
}
