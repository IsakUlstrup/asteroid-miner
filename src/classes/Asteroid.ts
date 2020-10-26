import { LoremIpsum } from "lorem-ipsum";
import { v4 as uuidv4 } from "uuid";
import Ore from "./Ore";
import CyanOre from "./CyanOre";
import MagentaOre from "./MagentaOre";
import YellowOre from "./YellowOre";
import BlackOre from "./BlackOre";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

export default class Asteroid {
  hp = (Math.random() + 1) * 40;
  id = uuidv4();
  name = lorem.generateWords(2);
  c: number;
  m: number;
  y: number;
  k: number;
  constructor() {
    this.c = Math.random() * 100;
    this.m = Math.random() * 100;
    this.y = Math.random() * 100;
    this.k = Math.random() * 10;
  }
  dropOre() {
    const ores:Ore[] = [];

    if (Math.floor(this.c) > 0) ores.push(new CyanOre(Math.floor(this.c)));
    if (Math.floor(this.m) > 0) ores.push(new MagentaOre(Math.floor(this.m)));
    if (Math.floor(this.y) > 0) ores.push(new YellowOre(Math.floor(this.y)));
    if (Math.floor(this.k) > 0) ores.push(new BlackOre(Math.floor(this.k)));

    return ores;
  }
}