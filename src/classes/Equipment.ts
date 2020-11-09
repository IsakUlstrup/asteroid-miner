import { Item, ItemType, EquipmentType, EquipmentStats } from "../types";

export default class Equipment implements Item {
  // metadata
  name: string;
  id: string;
  itemType: ItemType.equipment;
  type: EquipmentType;

  // stats
  effect: number;
  energyUse: number;
  energyBufferSize: number;
  fuelUse: number;
  fuelBufferSize: number;

  // state
  state: {
    powerModifier: number;
    energy: number;
    fuel: number;
  };

  // derived stats
  get derivedStats() {
    return {
      maxEnergy: this.energyBufferSize * this.state.powerModifier,
      effect: this.effect * this.state.powerModifier,
      energyUse: this.energyUse * this.state.powerModifier,
      fuelUse: this.fuelUse * this.state.powerModifier
    };
  }

  constructor(stats: EquipmentStats) {
    // set metadata
    this.name = stats.name !== undefined ? stats.name : "unnamed equipment";
    this.id = stats.id !== undefined ? stats.id : "89345-43534-234";
    this.itemType = ItemType.equipment;

    // set base stats
    this.type = stats.equipmentType;
    this.effect = stats.effect !== undefined ? stats.effect : 1;
    this.energyUse = stats.energyUse !== undefined ? stats.energyUse : 1;
    this.energyBufferSize =
      stats.energyBufferSize !== undefined ? stats.energyBufferSize : 10;
    this.fuelUse = stats.fuelUse !== undefined ? stats.fuelUse : 0;
    this.fuelBufferSize =
      stats.fuelBufferSize !== undefined ? stats.fuelBufferSize : 0;

    // Initialize state
    this.state = {
      powerModifier: 0,
      energy: 0,
      fuel: this.fuelBufferSize
    };
  }

  charge(amount: number) {
    if (this.desiredEnergy <= 0) return;

    if (amount > this.desiredEnergy) {
      this.state.energy = this.derivedStats.maxEnergy;
      return this.desiredEnergy;
    } else {
      this.state.energy += amount;
      return amount;
    }
  }
  discharge(amount: number) {
    if (amount <= 0) return;
    this.state.energy -= amount;
    if (this.state.energy < 0) this.state.energy = 0;
  }
  useFuel(amount: number) {
    if (amount <= 0) return;
    this.state.fuel -= amount;
    if (this.state.fuel < 0) this.state.fuel = 0;
  }
  setPower(power: number) {
    this.state.powerModifier = power;
  }
  use() {
    if (this.state.energy < this.derivedStats.energyUse) return 0;
    if (this.state.fuel < this.derivedStats.fuelUse) return 0;
    this.discharge(this.derivedStats.energyUse);
    this.useFuel(this.derivedStats.fuelUse);
    return this.derivedStats.effect;
  }
  get desiredEnergy() {
    const desired = this.derivedStats.maxEnergy - this.state.energy;
    if (desired > 0) {
      return desired;
    } else {
      return 0;
    }
  }
}
