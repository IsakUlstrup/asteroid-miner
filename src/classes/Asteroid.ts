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
  constructor(c: number, m: number, y: number, k: number) {
    this.c = c;
    this.m = m;
    this.y = y;
    this.k = k;
  }
}