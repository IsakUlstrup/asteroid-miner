import CanvasObject from "@/classes/CanvasObject";
import { OreType } from "@/types/enums";

export default class Ore extends CanvasObject {
  type: OreType;
  constructor(position: Vector3D, vector: Vector3D, type: OreType) {
    super(position, vector, 10, {
      c: type === OreType.cyan ? 100 : 0,
      m: type === OreType.magenta ? 100 : 0,
      y: type === OreType.yellow ? 100 : 0,
      k: type === OreType.black ? 100 : 0
    });
    this.type = OreType.cyan;
  }
}
