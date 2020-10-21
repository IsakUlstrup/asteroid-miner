export default class Player {
  name:string;
  credits:number;

  constructor(name:string) {
    this.name = name;
    this.credits = 0;
  }

  addCredits(amount: number) {
    this.credits += amount;
  }
}