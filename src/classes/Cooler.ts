import ShipComponent from "./ShipComponent";

export default class Cooler extends ShipComponent {
  constructor() {
    super("Cooler", "A basic cooler", .5, 0);
    this._effect = 2;
    this.modelInfo.type = "cooler";
    this.modelInfo.model = "alpha cooler"
  }
}