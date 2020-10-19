import ShipComponent from "./ShipComponent";

export default class Reactor extends ShipComponent {
  fuelConsumption:number;
  constructor() {
    super("Reactor", "A basic reactor", 0, .2);
    this.inactiveModifier = 0;
    this.fuelConsumption = 0.01;
  }
}