import Ore from "./Ore";

export default class MagentaOre extends Ore {
  constructor(quantity: number) {
    super("Magenta Ore", "A pinkish ore", 10, quantity);
  }
}