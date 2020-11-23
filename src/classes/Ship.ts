import { ShipType, EquipmentType, OreType } from "../types/enums";
import Equipment from "./Equipment";

export default class Ship {
  equipment: Equipment[];
  name: string;
  type: ShipType;
  equipmentSlots: number;
  position: number;
  vector: number;
  inventory: {
    c: number;
    m: number;
    y: number;
    k: number;
  };
  surplusEnergy: number;

  constructor(name: string, slots: number) {
    this.name = name;
    this.equipmentSlots = slots;
    this.equipment = new Array(slots);
    this.equipment.fill(new Equipment({ equipmentType: EquipmentType.none }));
    this.type = ShipType.eve;
    this.position = 0;
    this.vector = 0;
    this.inventory = {
      c: 0,
      m: 0,
      y: 0,
      k: 0
    };
    this.surplusEnergy = 0;
  }
  get reactors() {
    return this.equipment.filter(e => e && e.type === EquipmentType.reactor);
  }
  get engines() {
    return this.equipment.filter(e => e && e.type === EquipmentType.engine);
  }
  setEquipment(equipment: Equipment, slot: number) {
    if (slot > this.equipmentSlots) return;
    this.equipment[slot] = equipment;
  }
  lootOre(type: OreType, amount: number) {
    switch (type) {
      case OreType.cyan:
        this.inventory.c += amount;
        break;
      case OreType.magenta:
        this.inventory.m += amount;
        break;
      case OreType.yellow:
        this.inventory.y += amount;
        break;
      case OreType.black:
        this.inventory.k += amount;
        break;
      default:
        break;
    }
    return true;
  }
  generateEnergy() {
    let energy = 0;
    this.reactors.forEach(reactor => {
      energy += reactor.use();
    });
    return energy;
  }
  chargeEquipment(amount: number) {
    let energyLeft = amount;
    this.poweredEquipment.forEach(eq => {
      energyLeft -= eq.setEnergy(energyLeft / this.poweredEquipment.length);
    });
    this.surplusEnergy = energyLeft;
  }
  update(dt: number) {
    // energy distribution
    if (this.poweredEquipment.length > 0) {
      const energy = this.generateEnergy();
      // energy distribution
      this.chargeEquipment(energy);
    }
    // vector / movement
    this.engines.forEach(engine => {
      this.vector += engine.use() * dt;
    });
    this.position += this.vector;
  }
  get poweredEquipment() {
    // get non-reactor equipment that wants energy, sort by energy amount
    return this.equipment
      .filter(e => e && e.type !== EquipmentType.reactor && e.desiredEnergy > 0)
      .sort((n1, n2) => {
        if (n1 && n2 && n1.state.powerModifier > n2.state.powerModifier) {
          return 1;
        }
        if (n1 && n2 && n1.state.powerModifier < n2.state.powerModifier) {
          return -1;
        }
        return 0;
      });
  }
}
