import Item from "@/classes/Item";
import CanvasWrapper from "@/classes/CanvasWrapper";

export default class Module extends Item {
  constructor(name = "unnamed module") {
    super(name);
  }
  draw(canvas: CanvasWrapper, index: number, slotAmount: number) {
    // placeholder
  }
  update(dt: number) {
    // placeholder
  }
}
