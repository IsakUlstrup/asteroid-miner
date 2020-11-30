import GameLoop from "@/services/GameLoop";
import CanvasObject from "@/classes/CanvasObject";
import CanvasWrapper from "@/classes/CanvasWrapper";
import config from "@/config";

export default class RenderManager {
  private canvas: CanvasWrapper;
  private canvasObjects: CanvasObject[];
  private hudObjects: CanvasObject[];
  private cameraPosition: Vector3;
  constructor(
    canvasContext: CanvasRenderingContext2D,
    canvasObjects: CanvasObject[],
    hudObjects: CanvasObject[],
    cameraPosition: Vector3,
    resolutionScale = 1
  ) {
    this.canvas = new CanvasWrapper(canvasContext, resolutionScale);
    this.canvasObjects = canvasObjects;
    this.hudObjects = hudObjects;
    this.cameraPosition = cameraPosition;
    this.canvas.context.save();

    GameLoop.setFPSLimit(config.framerateLimit || 60);
    GameLoop.addListener((dt: number) => {
      this.mainLoop(dt);
    });
  }

  public addCanvasObject(object: CanvasObject) {
    this.canvasObjects.push(object);
    return true;
  }
  public removeCanvasObject(object: CanvasObject) {
    const index = this.canvasObjects.indexOf(object);
    if (index) {
      this.canvasObjects.splice(index, 1);
      return true;
    } else {
      console.log("index not found");
      return false;
    }
  }
  private update(dt: number) {
    // sort gameobjects based on z-position
    this.canvasObjects.sort((o1, o2) => {
      return o1.scale - o2.scale;
    });

    this.canvasObjects.forEach(object => {
      object.update(dt);
      if (object.isOffscreen) {
        this.removeCanvasObject(object);
      }
    });

    this.hudObjects.forEach(object => {
      object.update(dt);
    });
  }
  private draw(canvas: CanvasWrapper) {
    canvas.context.clearRect(0, 0, canvas.size.width, canvas.size.height);

    // draw canvasObjects
    this.canvasObjects.forEach(object => {
      canvas.context.restore();
      object.draw(canvas, this.cameraPosition.z);
    });

    // draw HUD
    this.hudObjects.forEach(object => {
      canvas.context.restore();
      object.draw(canvas, this.cameraPosition.z);
    });
  }
  private mainLoop(dt: number) {
    this.update(dt);
    this.draw(this.canvas);
  }
}
