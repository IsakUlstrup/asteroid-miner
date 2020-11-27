export default class Item {
  id: number;
  name: string;
  constructor(name = "unnamed item", id = Math.random()) {
    this.id = id;
    this.name = name;
  }
}
