import Ore from "./Ore";

export default class CyanOre extends Ore {
  constructor(quantity: number) {
    super("Cyan Ore", "A blueish ore", 10, quantity);
  }
}