export default class Asteroid {
  name: string;
  hp: number;
  id: number;
  constructor() {
    this.name = "skdlfhnsdf";
    this.hp = 100;
    this.id = Math.random();
  }
  mine(power: number) {
    this.hp -= power;
    if (this.hp <= 0) this.hp = 0;
  }
}
