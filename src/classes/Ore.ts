import CanvasObject from "@/classes/CanvasObject";

export enum OreType {
  cyan,
  magenta,
  yellow,
  black
}

export default class Ore extends CanvasObject {
  constructor(transform: Vector3, vector: Vector3, type: OreType) {
    let color: CMYKColor = { c: 0, m: 0, y: 0, k: 0 };
    switch (type) {
      case OreType.cyan:
        color = { c: 100, m: 0, y: 0, k: 0 };
        break;
      case OreType.magenta:
        color = { c: 0, m: 100, y: 0, k: 0 };
        break;
      case OreType.yellow:
        color = { c: 0, m: 0, y: 100, k: 0 };
        break;
      case OreType.black:
        color = { c: 0, m: 0, y: 0, k: 100 };
        break;
      default:
        break;
    }
    super(transform, vector, 10, 0, color);
  }
}
