import { Color } from './color';
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

  public get pawnColor(): Color {
    return this.pawns[0].color;
  }

  public putPawnOnHomeField(pawn: Pawn, homeFields: HomeField[]): void {
    if (this.pawns.includes(pawn)) {
      pawn.moveTo(this.findEmptyHomeField(homeFields));
    } else {
      throw new Error("Player can only move it's own pawns");
    }
  }

  private findEmptyHomeField(homeFields: HomeField[]): HomeField {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return homeFields.find((homeField) => !homeField.pawn)!;
  }

  public putPawnsOnHomeFields(homeFields: HomeField[]): void {
    this.pawns.forEach((pawn, i) => {
      pawn.moveTo(homeFields[i]);
    });
  }

  public rollDice(dice: Dice): void {
    this._latestDiceRoll = dice.roll();
  }

  public movePawn(pawn: Pawn): Pawn | undefined {
    if (this.pawns.includes(pawn)) {
      return pawn.moveToFieldAfter(this.latestDiceRoll);
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
    const pawnOnStartField = this.findPawnOnStartField();
    if (pawnOnStartField) {
      this.movePawn(pawnOnStartField);
    }
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
