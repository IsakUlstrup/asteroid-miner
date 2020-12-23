import gameLoop from "../services/GameLoop";
import GameObjectManager from "../engine/GameObjectManager";
import ShipPlayer from "./ShipPlayer";
import WorldGeneration from "./WordGeneration";
import ShipStation from "./ShipStation";

export default class Game {
  private renderer: GameObjectManager;
  private ship: ShipPlayer;
  private worldGen: WorldGeneration;
  constructor(canvasQuery: string, ship: ShipPlayer) {
    this.ship = ship;

    // setup & resize canvas
    const canvas = document.querySelector(canvasQuery) as HTMLCanvasElement;
    if (!canvas) {
      throw "canvas element not found";
    }

    this.initCanvas(canvas);
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    this.renderer = new GameObjectManager(context, this.ship);
    this.worldGen = new WorldGeneration(this.ship.transform, this.renderer);
  }
  public start() {
    this.renderer.addGameObject(this.worldGen);
    this.renderer.addGameObject(
      new ShipStation({ x: 200, y: 200 }, { r: 255, g: 255, b: 255 })
    );
    this.renderer.addGameObject(this.ship);

    // start main loop
    gameLoop.addListener((dt: number) => {
      this.mainLoop(dt);
    });
  }
  mainLoop(dt: number) {
    this.renderer.update(dt);
    this.renderer.draw();
  }
  initCanvas(canvas: HTMLCanvasElement) {
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    const devicePixelRatio = window.devicePixelRatio || 1;
    window.addEventListener("resize", () => {
      this.resizeCanvas(canvas, devicePixelRatio);
    });
    this.resizeCanvas(canvas, devicePixelRatio);
  }
  resizeCanvas(canvas: HTMLCanvasElement, devicePixelRatio: number) {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(devicePixelRatio * rect.width);
    canvas.height = Math.round(devicePixelRatio * rect.height);
    canvas.getContext("2d")?.scale(1 / devicePixelRatio, 1 / devicePixelRatio);
  }
}
