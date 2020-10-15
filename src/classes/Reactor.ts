import ShipComponent from "./ShipComponent";

export default class Reactor extends ShipComponent {
  constructor() {
    super("Reactor", "A basic reactor", 0, 1.2);
    this.inactiveModifier = 0;
  }
}