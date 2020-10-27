import ShipComponent from "./ShipComponent";

export default class Navigation extends ShipComponent {
  constructor() {
    super("Navigation", "Basic navigation", 0.1, 0.1);
    this.modelInfo.type = "navigation";
    this.modelInfo.model = "alpha navigation"
  }
}