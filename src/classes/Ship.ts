import { ShipType, EquipmentType, OreType } from "../types/enums";
import Equipment from "./Equipment";

export default class Ship {
  equipment: Equipment[];
  name: string;
  type: ShipType;
  equipmentSlots: number;
  position: number;
  inventory: {
    c: number;
    m: number;
    y: number;
    k: number;
  }

  constructor(name: string, slots: number) {
    this.name = name;
    this.equipmentSlots = slots;
    this.equipment = new Array(slots);
    this.equipment.fill(new Equipment({ equipmentType: EquipmentType.none }));
    this.type = ShipType.eve;
    this.position = 0;
    this.inventory = {
      c: 0,
      m: 0,
      y: 0,
      k: 0
    };
  }
  get reactors() {
    return this.equipment.filter(e => e && e.type === "reactor");
  }
  setEquipment(equipment: Equipment, slot: number) {
    if (slot > this.equipmentSlots) return;
    this.equipment[slot] = equipment;
  }
  move(speed: number) {
    this.position += speed;
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
    this.chargeableEquipment.forEach(eq => {
      energyLeft -= eq?.charge(energyLeft / this.chargeableEquipment.length) || 0;
    });
  }
  get chargeableEquipment() {
    // get non-reactor equipment that wants energy, sort by energy amount
    return this.equipment
      .filter(e => e && e.type !== EquipmentType.reactor && e.desiredEnergy > 0)
      .sort((n1, n2) => {
        if (n1 && n2 && n1.desiredEnergy > n2.desiredEnergy) {
          return 1;
        }
        if (n1 && n2 && n1.desiredEnergy < n2.desiredEnergy) {
          return -1;
        }
        return 0;
      });
  }
}
