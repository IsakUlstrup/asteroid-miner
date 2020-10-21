import Ore from "./Ore";

export default class YellowOre extends Ore {
  constructor(quantity: number) {
    super("Yellow Ore", "A yellow ore", 10, quantity);
  }
}