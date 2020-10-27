import ShipComponent from "./ShipComponent";

export default class MiningLaser extends ShipComponent {
  constructor() {
    super("Mining laser", "A basic mining laser", 1, .5);
    this.modelInfo.type = "laser";
    this.modelInfo.model = "alpha laser"
  }
}