export default class Asteroid {
  name: string;
  hp: number;
  id: number;
  position: {
    x: number;
    y: number;
    z: number;
    r: number;
  };
  vector: {
    x: number;
    y: number;
    z: number;
    r: number;
  };
  color: {
    r: number;
    g: number;
    b: number;
  };

  constructor() {
    this.name = `Asteroid #${((Math.random() + 1) * 100).toFixed(0)}`;
    this.hp = 100;
    this.id = Math.random();

    this.position = {
      x: Math.random() * 800,
      y: Math.random() * 400,
      z: Math.random() * 200,
      r: Math.random() * 50
    };

    this.vector = {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01,
      r: (Math.random() - 0.5) * 0.01
    };

    this.color = {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255
    }
  }
  mine(power: number) {
    this.hp -= power;
    if (this.hp <= 0) this.hp = 0;
  }
  move(x: number, y: number, z: number, r: number) {
    this.position = {
      x: this.position.x += x,
      y: this.position.y += y,
      z: this.position.z += z,
      r: this.position.r += r
    };
  }
}
