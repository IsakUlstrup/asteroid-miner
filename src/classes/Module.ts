import Item from "@/classes/Item";
import CanvasWrapper from "@/classes/CanvasWrapper";

export default class Module extends Item {
  effect: number;
  constructor(name = "unnamed module", effect: number) {
    super(name);
    this.effect = effect;
  }
  draw(canvas: CanvasWrapper, index: number, slotAmount: number) {
    // placeholder
  }
  update(dt: number, canvas: CanvasWrapper) {
    // placeholder
  }
}
