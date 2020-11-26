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
import { EquipmentType, OreType } from "@/types/enums";
import Beam from "@/classes/Beam";
import GameLoop from "@/services/GameLoop";

export default class SpaceGame {
  ship: Ship;
  context: CanvasRenderingContext2D;
  gameObjects: CanvasObject[] = [];
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

    // sort asteroids based on z-position
    this.gameObjects.sort((o1, o2) => {
      return o1.projected.s - o2.projected.s;
    });

    // hit scan, loop asteroids backwards to find frontmost asteroid first
    for (let index = this.getAsteroids().length - 1; index >= 0; index--) {
      const asteroid = this.getAsteroids()[index] as Asteroid;
      if (
        this.cursor.active &&
        isWithinCircle(
          this.cursor.x,
          this.cursor.y,
          asteroid.projected.x,
          asteroid.projected.y,
          (asteroid.size * asteroid.projected.s) / 2
        )
      ) {
        // mine if any laser is active and wehave a target
        this.target = asteroid;
        this.ship.equipment.forEach(equipment => {
          if (
            this.target &&
            equipment.type === EquipmentType.laser &&
            equipment.state.powerModifier > 0
          ) {
            const equipmentEffect = equipment.use() * dt;
            const mined = this.target.mine({
              c: equipment.color.cmyk().c * equipmentEffect,
              m: equipment.color.cmyk().m * equipmentEffect,
              y: equipment.color.cmyk().y * equipmentEffect,
              k: equipment.color.cmyk().k * equipmentEffect
            });
            this.generateOre(this.target, OreType.cyan, mined.c);
            this.generateOre(this.target, OreType.magenta, mined.m);
            this.generateOre(this.target, OreType.yellow, mined.y);
            this.generateOre(this.target, OreType.black, mined.k);
          }
        });
        break;
      }
    }
    // context.emit("target", target);

    // gravity vortex
    for (let index = this.getOre().length - 1; index >= 0; index--) {
      const o = this.getOre()[index] as Ore;
      if (this.cursor.active) {
        this.ship.equipment.forEach(equipment => {
          if (
            equipment.type === EquipmentType.gravityVortex &&
            equipment.state.powerModifier > 0
          ) {
            equipment.use();
            if (
              circlesIntersect(
                o.projected.x,
                o.projected.y,
                o.size / 2,
                this.cursor.x,
                this.cursor.y,
                equipment.derivedStats.effect
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

    // draw asteroids
    this.gameObjects.forEach(o => {
      o.draw(context, this.resolutionScale, cameraPosition);
    });

    // beams
    if (this.cursor.active) {
      const equipmentSpacing = canvasSize.width / this.ship.equipment.length;

      // loop ship equipment, draw laser for each laser equipment
      for (let index = 0; index < this.ship.equipment.length; index++) {
        const equipment = this.ship.equipment[index];
        // draw laser if its powered
        if (
          equipment.type === EquipmentType.laser &&
          equipment.state.powerModifier > 0
        ) {
          // laser
          new Beam(
            equipmentSpacing * index,
            canvasSize.height,
            this.cursor.x,
            this.cursor.y,
            1
          ).draw(context, equipment.color);
        }

        // draw gravity vortex if it's powered
        if (
          context &&
          equipment.type === EquipmentType.gravityVortex &&
          equipment.state.powerModifier > 0
        ) {
          // vortex
          context.restore();
          context.beginPath();
          context.strokeStyle = "rgb(255, 255, 255)";
          context.arc(
            this.cursor.x,
            this.cursor.y,
            equipment.derivedStats.effect,
            0,
            2 * Math.PI
          );
          context.stroke();
        }
      }
    }

    context.restore();
  }
}
