import { Dice } from './dice';
import { Pawn } from './pawn';

export class Player {
  private _latestDiceRoll: number = 0;

  constructor(readonly pawns: Pawn[]) {}

  get latestDiceRoll() {
    return this._latestDiceRoll;
  }

  rollDice(dice: Dice) {
    this._latestDiceRoll = dice.roll();
  }
}
