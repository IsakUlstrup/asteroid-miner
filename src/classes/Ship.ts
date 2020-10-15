// import ShipComponent from "./ShipComponent";
import Item from "./Item";
import Reactor from "./Reactor";
import Cooler from "./Cooler";
import MiningLaser from "./MiningLaser";

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
  inventory:Item[] = [];
  inventorySize = 50;
  reactors:Reactor[] = [];
  coolers:Cooler[] = [];
  lasers:MiningLaser[] = [];

  dtModifier = .1;

  constructor(name:string) {
    this.name = name;
  }
  update(dt:number) {
    this.totalHeating = 0;
    

    // lasers
    this.lasers.forEach(laser => {
      if (this.energy <= 0) laser.enabled = false;
      this.energy -= laser.energyUse * (dt * this.dtModifier);
      this.heat += laser.heating * (dt * this.dtModifier);
    });

    // coolers
    this.coolers.forEach(cooler => {
      if (this.energy <= 0) cooler.enabled = false;
      if (this.heat > 0) {
        cooler.active = true;
      } else {
        cooler.active = false;
      }

      this.energy -= cooler.energyUse * (dt * this.dtModifier);
      this.heat -= cooler.effect * (dt * this.dtModifier);
    });

    // reactors
    this.reactors.forEach(reactor => {
      if (this.energy < this.maxEnergy) {
        reactor.active = true;
      } else {
        reactor.active = false;
      }

      this.energy += reactor.effect * (dt * this.dtModifier);
      this.heat += reactor.heating * (dt * this.dtModifier);
      this.totalHeating += reactor.heating * (dt * this.dtModifier);
      if (this.energy > this.maxEnergy) this.energy = this.maxEnergy;
    });

    // passive cooling
    this.heat -= this.coolingRate * (dt * this.dtModifier);
    if (this.heat < 0) this.heat = 0;
    if (this.heat > this.maxHeat) this.heat = this.maxHeat;
    if (this.energy < 0) this.energy = 0;
  }
  activateLasers() {
    this.lasers.forEach(laser => {
      if (!laser.enabled) return;
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
  lootItem(item:Item) {
    this.inventory.push(item);
  }
  get components() {
    return [...this.reactors, ...this.coolers, ...this.lasers];
  }
  get enabledLasers() {
    return this.lasers.filter(l => l.enabled);
  }
  get inventoryVolume() {
    let volume = 0;
    this.inventory.forEach(item => volume += item.volume);
    return volume;
  }
}