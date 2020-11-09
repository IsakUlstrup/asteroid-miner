export enum ShipType {
  eve,
  retro
}

export enum ItemType {
  equipment
}

export interface Item {
  name: string;
  id: string;
  itemType: ItemType;
}

export enum EquipmentType {
  reactor = "reactor",
  laser = "laser",
  none = "none"
}

export interface EquipmentStats {
  equipmentType: EquipmentType;
  name?: string;
  id?: string;
  effect?: number;
  energyUse?: number;
  energyBufferSize?: number;
  fuelUse?: number;
  fuelBufferSize?: number;
}