import { Dice } from './dice';
import { Pawn } from './pawn';

export class Player {
  private _numberOfEyesRolledWithDice: number = 0;

  constructor(readonly pawns: Pawn[]) {}

  get numberOfEyesRolledWithDice() {
    return this._numberOfEyesRolledWithDice;
  }

  rollDice(dice: Dice) {
    this._numberOfEyesRolledWithDice = dice.roll();
  }
}
