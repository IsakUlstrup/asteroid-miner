import ShipComponent from "./ShipComponent";

export default class Scanner extends ShipComponent {
  constructor() {
    super("Scanner", "A basic asteroid scanner", 1, .5);
    this.modelInfo.type = "scanner";
    this.modelInfo.model = "alpha scanner"
  }
}