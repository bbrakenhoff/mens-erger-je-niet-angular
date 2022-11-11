import { Dice } from './dice';
import { HomeField } from './fields/home-field';
import { NormalField } from './fields/normal-field';
import { StartField } from './fields/start-field';
import { Pawn } from './pawn';

export class Player {
  public readonly pawns: Pawn[] = [];
  private _latestDiceRoll = 0;

  public get latestDiceRoll(): number {
    return this._latestDiceRoll;
  }

  public putPawnsOnHomeFields(homeFields: HomeField[]): void {
    this.pawns.forEach((pawn, i) => {
      pawn.moveTo(homeFields[i]);
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
    this.findPawnOnStartField()?.moveFurther(this.latestDiceRoll);
  }

  private findPawnOnStartField(): Pawn | undefined {
    return this.pawns.find(
      (pawn) =>
        pawn.field instanceof StartField && pawn.field.color === pawn.color
    );
  }

  public hasPawnsToMove(): boolean {
    return this.pawns.some(
      (pawn) =>
        pawn.field instanceof StartField || pawn.field instanceof NormalField
    );
  }
}
