import Ore from "./Ore";

export default class BlackOre extends Ore {
  constructor(quantity: number) {
    super("Black Ore", "A black ore", 10, quantity);
  }
}