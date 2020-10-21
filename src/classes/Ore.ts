import Item from "./Item"

export default class Ore extends Item {
  quantity: number;
  constructor(name: string, description: string, volume: number, quantity: number) {
    super(name, description, volume, true);
    this.quantity = quantity;
  }
}