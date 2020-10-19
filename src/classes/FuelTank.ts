import ShipComponent from "./ShipComponent"

export default class FuelTank extends ShipComponent {
  capacity:number;
  current:number;
  constructor() {
    super("Fuel tank", "A basic fuel tank", 0, 0);
    this.capacity = 100;
    this.current = 100;
  }
}