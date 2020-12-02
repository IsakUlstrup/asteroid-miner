import Module from "@/classes/Module";
import CanvasObject from "@/classes/CanvasObject";

export enum TargetMode {
  manual,
  auto
}

export default class GravityVortex extends Module {
  constructor(
    name: string,
    canvasObjects: CanvasObject[],
    targetMode: TargetMode,
    effect: number
  ) {
    super(name, effect);
  }
}
