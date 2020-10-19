import ShipConponent from "./ShipComponent";

export default class Engine extends ShipConponent {
  constructor() {
    super("Engine", "A basic engine", 1, 1);
  }
  use() {
    this.active = true;
    const effect = this.effect;
    this.active = false;
    return effect;
  }
}