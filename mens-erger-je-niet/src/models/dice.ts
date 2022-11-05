export class Dice {
  public roll(): number {
    return Math.floor(Math.random() * 6) + 1;
  }
}
