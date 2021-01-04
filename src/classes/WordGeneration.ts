import GameObject from "../engine/GameObject";
import config from "../config";
import GameObjectManager from "../engine/GameObjectManager";
import Asteroid from "./Asteroid";
import Star from "./Star";
import Vector2 from "@/engine/Vector2";

export default class WorldGeneration extends GameObject {
  renderer: GameObjectManager;
  asteroidSpread: number;
  constructor(transform: Vector2, gameObjects: GameObjectManager) {
    super(transform);
    this.renderer = gameObjects;
    this.asteroidSpread = 50000;
  }

  addAsteroid() {
    this.renderer.addGameObject(
      new Asteroid(
        new Vector2(
          (Math.random() - 0.5) * this.asteroidSpread,
          (Math.random() - 0.5) * this.asteroidSpread
        )
      )
    );
  }
  addStar() {
    this.renderer.addParallaxObject(
      new Star(
        new Vector2(
          (Math.random() - 0.5) * 50000,
          (Math.random() - 0.5) * 50000
        ),
        {
          r: 255,
          g: 255,
          b: 255
        }
      )
    );
  }
  update() {
    if (this.renderer.objects.length < config.maxAsteroidCount) {
      this.addAsteroid();
      this.addStar();
    }
  }
  draw() {
    return;
  }
}
