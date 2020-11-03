import ShipComponent from "./ShipComponent";

interface CMYCKColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

export default class MiningLaser extends ShipComponent {
  color:CMYCKColor;
  constructor() {
    super("Mining laser", "A basic mining laser", 1, .5);
    this.modelInfo.type = "laser";
    this.modelInfo.model = "alpha laser";
    this.color = {
      c: 100,
      m: 0,
      y: 0,
      k: 0
    }
  }
  setColor(color: CMYCKColor) {
    // console.log(color);
    this.color = color;
  }
}