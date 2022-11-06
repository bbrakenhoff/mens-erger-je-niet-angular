import { Dice } from './dice';
import { HomeField } from './fields/home-field';
import { StartField } from './fields/start-field';
import { Pawn } from './pawn';

export class Player {
  private _latestDiceRoll = 0;

  public constructor(public readonly pawns: Pawn[]) {}

  public get latestDiceRoll(): number {
    return this._latestDiceRoll;
  }

  public putPawnsOnHomeFields(homeFields: HomeField[]): void {
    this.pawns.forEach((pawn, i) => {
      pawn.goToField(homeFields[i]);
    });
  }

  public rollDice(dice: Dice): void {
    this._latestDiceRoll = dice.roll();
  }

  public movePawn(pawn: Pawn): void {
    if (this.pawns.includes(pawn)) {
      pawn.moveToNextField();
    } else {
      throw new Error("Player can only move it's own pawns");
    }
  }

  public movePawnToStartField(): void {
    this.findPawnOnHomeField()?.moveToNextField();
  }

  private findPawnOnHomeField(): Pawn | undefined {
    return this.pawns.find((pawn) => pawn.field instanceof HomeField);
  }

  public movePawnFromStartField(): void {
    this.findPawnOnStartField()?.moveToNextField();
  }

  private findPawnOnStartField(): Pawn | undefined {
    return this.pawns.find(
      (pawn) =>
        pawn.field instanceof StartField && pawn.field.color === pawn.color
    );
  }
}
