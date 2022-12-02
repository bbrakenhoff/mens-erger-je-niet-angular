import { Color } from './color';
import { Dice } from './dice';
import { HomeField } from './fields/home-field';
import { NormalField } from './fields/normal-field';
import { StartField } from './fields/start-field';
import { Pawn } from './pawn';
import { Turn } from './turn';

export class Player {
  public readonly pawns: Pawn[] = [];

  private turn?: Turn;

  public startTurn(): void {
    this.turn = {
      diceRoll: undefined,
      isPlayerPuttingPawnOnStartField: false,
    };
  }

  public stopTurn(): void {
    this.turn = undefined;
  }

  public startPuttingPawnOnStartField(): void {
    if (this.turn) {
      this.turn.diceRoll = undefined;
      this.turn.isPlayerPuttingPawnOnStartField = true;
    }
  }

  public get latestDiceRoll(): number | undefined {
    return this.turn?.diceRoll;
  }

  public get pawnColor(): Color {
    return this.pawns[0].color;
  }

  public get isPlayerPuttingPawnOnStartField(): boolean {
    return this.turn?.isPlayerPuttingPawnOnStartField === true;
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
    if (this.turn) {
      this.turn.diceRoll = dice.roll();
    } else {
      throw new Error(
        'Player must have an active turn in order to roll the dice'
      );
    }
  }

  public movePawn(pawn: Pawn): Pawn | undefined {
    if (this.pawns.includes(pawn) && this.latestDiceRoll) {
      return pawn.moveToFieldAfter(this.latestDiceRoll);
    } else {
      throw new Error("Player can only move it's own pawns");
    }
  }

  public movePawnToStartField(): void {
    this.findPawnOnHomeField()?.moveToNextField();
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
