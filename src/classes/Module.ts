import Item from "@/classes/Item";

export default class Module extends Item {
  constructor(name = "unnamed module") {
    super(name);
  }
  draw(context: CanvasRenderingContext2D, resolutionScale: number) {
    // placeholder
  }
  update(dt: number) {
    // placeholder
  }
}
