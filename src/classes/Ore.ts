import CanvasObject from "@/classes/CanvasObject";

export default class Ore extends CanvasObject {
  constructor(
    transform: Vector3,
    vector: Vector3,
    size: number,
    color: RGBColor | CMYKColor
  ) {
    super(transform, vector, size, 0, color);
  }
}
