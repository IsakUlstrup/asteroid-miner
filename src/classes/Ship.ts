// import ShipComponent from "./ShipComponent";
import Item from "./Item";
import Ore from "./Ore";
import Reactor from "./Reactor";
import Cooler from "./Cooler";
import MiningLaser from "./MiningLaser";
import Engine from "./Engine";
import FuelTank from "./FuelTank";

export default class Ship {
  energy = 0;
  maxEnergy = 100;
  name = "Unnamed ship";
  energyProduction = 0;
  heat = 0;
  maxHeat = 100;
  coolingRate = .001;
  totalEnergyUsage = 0;
  totalHeating = 0;
  inventory:Ore[] = [];
  inventorySize = 500;
  reactors:Reactor[] = [];
  coolers:Cooler[] = [];
  lasers:MiningLaser[] = [];
  engines:Engine[] = [];
  fuelTanks:FuelTank[] = [];
  pause = false;

  dtModifier = .1;

  constructor(name:string) {
    this.name = name;
  }
  update(dt:number) {
    if (this.pause === true) return;
    this.totalHeating = 0;
    
    // reactors
    this.reactors.forEach(reactor => {
      if (this.energy < this.maxEnergy && this.remainingFuel > 0 && reactor.power > 0) {
        reactor.active = true;
      } else {
        reactor.active = false;
      }

      this.energy += reactor.effect * (dt * this.dtModifier);
      this.heat += reactor.heating * (dt * this.dtModifier);
      this.useFuel(reactor.effect * (dt * this.dtModifier) * reactor.fuelConsumption);
      // this.totalHeating += reactor.heating * (dt * this.dtModifier);
      if (this.energy > this.maxEnergy) this.energy = this.maxEnergy;
    });

    // engines
    this.engines.forEach(engine => {
      if (this.energy <= 0) engine.power = 0;
      this.energy -= engine.energyUse;
      this.heat += engine.heating;
    });

    // lasers
    this.lasers.forEach(laser => {
      if (this.energy <= 0) laser.power = 0;
      this.energy -= laser.energyUse * (dt * this.dtModifier);
      this.heat += laser.heating * (dt * this.dtModifier);
    });

    // coolers
    this.coolers.forEach(cooler => {
      if (this.energy <= 0) cooler.power = 0;
      if (this.heat > 0 && cooler.power > 0) {
        cooler.active = true;
      } else {
        cooler.active = false;
      }

      this.energy -= cooler.energyUse * (dt * this.dtModifier);
      this.heat -= cooler.effect * (dt * this.dtModifier);
    });

    // passive cooling
    this.heat -= this.coolingRate * (dt * this.dtModifier);
    if (this.heat < 0) this.heat = 0;
    if (this.heat > this.maxHeat) this.heat = this.maxHeat;
    if (this.energy < 0) this.energy = 0;
  }
  setPause(state: boolean) {
    this.pause = state;
  }
  activateLasers() {
    this.lasers.forEach(laser => {
      if (laser.power === 0) return;
      laser.active = true;
    });
  }
  deactivateLasers() {
    this.lasers.forEach(laser => {
      laser.active = false;
    });
  }
  addReactor(reactor:Reactor) {
    this.reactors.push(reactor);
  }
  addCooler(cooler:Cooler) {
    this.coolers.push(cooler);
  }
  addMiningLaser(laser:MiningLaser) {
    this.lasers.push(laser);
  }
  addEngine(engine:Engine) {
    this.engines.push(engine);
  }
  addFuelTank(tank:FuelTank) {
    this.fuelTanks.push(tank);
  }
  refuel(amount: number) {
    const amountPerTank = amount / this.fuelTanks.length;
    this.fuelTanks.forEach(tank => {
      tank.current += amountPerTank;
      if (tank.current > tank.capacity) tank.current = tank.capacity;
    });
  }
  recharge() {
    this.energy = this.maxEnergy;
  }
  useFuel(amount:number) {
    const amountPerTank = amount / this.fuelTanks.length;
    this.fuelTanks.forEach(t => t.current -= amountPerTank);
  }
  lootOre(ore: Ore) {
    const availableSpace = this.inventorySize - this.inventoryVolume;
    if (availableSpace > ore.volume * ore.quantity) {
      this.inventory.push(ore);
      return true;
    } else {
      return false;
    }
  }
  removeOre(ore: Ore) {
    this.inventory.splice(this.inventory.indexOf(ore), 1);
  }
  get components() {
    return [...this.reactors, ...this.coolers, ...this.lasers, ...this.engines, ...this.fuelTanks];
  }
  get poweredLasers() {
    return this.lasers.filter(l => l.power > 0);
    // return this.lasers;
  }
  get poweredEngines() {
    return this.engines.filter(e => e.power > 0);
    // return this.engines;
  }
  get remainingFuel() {
    let fuel = 0;
    this.fuelTanks.forEach(tank => {
      fuel += tank.current;
    });
    return fuel;
  }
  get fuelCapacity() {
    let capacity = 0;
    this.fuelTanks.forEach(tank => {
      capacity += tank.capacity;
    });
    return capacity;
  }
  canLoot(volume: number) {
    if ((this.inventorySize - this.inventoryVolume) > volume) {
      return true;
    } else {
      return false;
    }
  }
  get inventoryVolume() {
    let volume = 0;
    this.inventory.forEach(item => volume += item.volume * item.quantity);
    return volume;
  }
}