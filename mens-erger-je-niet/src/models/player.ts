import { Dice } from './dice';
import { Pawn } from './pawn';

export class Player {
  private _latestDiceRoll = 0;

  public constructor(public readonly pawns: Pawn[]) {}

  public get latestDiceRoll(): number {
    return this._latestDiceRoll;
  }

  public rollDice(dice: Dice): void {
    this._latestDiceRoll = dice.roll();
  }
}
