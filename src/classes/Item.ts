import { v4 as uuidv4 } from "uuid";

export default class Item {
  id:string;
  name:string;
  volume:number;
  stackable:boolean;
  icon = false; // add later
  description:string;

  constructor(name:string, description="No description", volume=1, stackable=false, id=uuidv4()) {
    this.name = name;
    this.description = description;
    this.volume = volume;
    this.stackable = stackable;
    this.id = id;
  }
}