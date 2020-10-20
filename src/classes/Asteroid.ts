import { LoremIpsum } from "lorem-ipsum";

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
  hp = 100;
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
}