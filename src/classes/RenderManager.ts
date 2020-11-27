import GameLoop from "@/services/GameLoop";
import CanvasObject from "@/classes/CanvasObject";
import { getScaledCanvasDimendsions } from "@/services/Utils";

export default class RenderManager {
  private context: CanvasRenderingContext2D;
  private resolutionScale: number;
  private canvasObjects: CanvasObject[];
  private cameraPosition: Transform;
  constructor(
    context: CanvasRenderingContext2D,
    canvasObjects: CanvasObject[],
    cameraPosition: Transform,
    resolutionScale = 1
  ) {
    this.context = context;
    this.resolutionScale = resolutionScale;
    this.canvasObjects = canvasObjects;
    this.cameraPosition = cameraPosition;
    this.context.save();

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
    this.canvasObjects.forEach(object => {
      object.update(dt);
    });
  }
  private draw(context: CanvasRenderingContext2D) {
    const canvasSize = getScaledCanvasDimendsions(
      context.canvas,
      this.resolutionScale
    );
    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    this.canvasObjects.forEach(object => {
      context.restore();
      object.draw(context, this.resolutionScale, this.cameraPosition.z);
    });
  }
  private mainLoop(dt: number) {
    this.update(dt);
    this.draw(this.context);
  }
}
