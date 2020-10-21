import Ship from "./Ship";
import Reactor from "./Reactor";
import Cooler from "./Cooler";
import MiningLaser from "./MiningLaser";
import Engine from "./Engine";
import FuelTank from "./FuelTank";

export default class TestShip extends Ship {
  constructor() {
    super("Test ship");
    this.addReactor(new Reactor());
    this.addCooler(new Cooler());
    this.addMiningLaser(new MiningLaser());
    this.addEngine(new Engine());
    this.addFuelTank(new FuelTank());

    this.inventorySize = 1000;
  }
}
