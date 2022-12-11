import { BehaviorSubject } from 'rxjs';
import { Color } from './color';
import { Dice } from './dice';
import { HomeField } from './fields/home-field';
import { NormalField } from './fields/normal-field';
import { StartField } from './fields/start-field';
import { Pawn } from './pawn';
import { Turn } from './turn';

export class Player {
  public pawns: Pawn[] = [];

  private readonly _turn$$ = new BehaviorSubject<Turn | undefined>(undefined);
  public readonly turn$ = this._turn$$.asObservable();

  public get pawnColor(): Color {
    return this.pawns[0].color;
  }

  public startTurn(): void {
    this._turn$$.next({
      diceRoll: -1,
      isPlayerPuttingPawnOnStartField: false,
    });
  }

  public endTurn(): void {
    this._turn$$.next(undefined);
  }

  public putPawnOnHomeField(
    pawn: Pawn,
    homeFields: readonly HomeField[]
  ): void {
    if (this.pawns.includes(pawn)) {
      pawn.moveTo(this.findEmptyHomeField(homeFields));
    } else {
      throw new Error("Player can only move it's own pawns");
    }
  }

  private findEmptyHomeField(homeFields: readonly HomeField[]): HomeField {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return homeFields.find((homeField) => !homeField.pawn)!;
  }

  public putPawnsOnHomeFields(homeFields: readonly HomeField[]): void {
    this.pawns.forEach((pawn, i) => {
      pawn.moveTo(homeFields[i]);
    });
  }

  public rollDice(dice: Dice): void {
    if (this._turn$$.value) {
      this._turn$$.next({
        diceRoll: dice.roll(),
        isPlayerPuttingPawnOnStartField:
          this._turn$$.value.isPlayerPuttingPawnOnStartField,
      });
    } else {
      this._turn$$.error(
        Error('Player must have an active turn in order to roll the dice')
      );
    }
  }

  public movePawn(pawn: Pawn): Pawn | undefined {
    if (this.pawns.includes(pawn) && this._turn$$.value?.diceRoll) {
      return pawn.moveToFieldAfter(this._turn$$.value.diceRoll);
    } else {
      throw new Error("Player can only move it's own pawns");
    }
  }

  public movePawnToStartField(): void {
    this.findPawnOnHomeField()?.moveToNextField();
    this._turn$$.next({
      diceRoll: -1,
      isPlayerPuttingPawnOnStartField: true,
    });
  }

  public findPawnOnHomeField(): Pawn | undefined {
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
