import { Board } from './board';
import { allColors } from './color';
import { Dice } from './dice';
import { Pawn } from './pawn';
import { Player } from './player';

export class BoardGame {
  public constructor(
    public readonly players: readonly Player[] = [
      new Player(),
      new Player(),
      new Player(),
      new Player(),
    ],
    private readonly firstPlayerIndex: number,
    private readonly dice = new Dice(),
    public readonly board = new Board()
  ) {
    this.letPlayersPutPawnsOnHomeFields();
  }

  private static createPawns(): readonly Pawn[][] {
    const allPawnsInGame: Pawn[][] = [];
    allColors.forEach((color) => {
      const pawns = [];
      for (let i = 0; i < 4; i++) {
        pawns.push(new Pawn(color));
      }
      allPawnsInGame.push(pawns);
    });

    return allPawnsInGame;
  }

  private letPlayersPutPawnsOnHomeFields(): void {
    const allPawnsInGame: readonly Pawn[][] = BoardGame.createPawns();
    allPawnsInGame.forEach((pawns: Pawn[], i) => {
      const matchingHomeFields = this.board.getFieldGroupByColor(
        pawns[0].color
      ).homeFields;
      this.players[i].pawns.push(...pawns);
      this.players[i].putPawnsOnHomeFields(matchingHomeFields);
    });
  }

  // private nextPlayerIndex(): number {
  //   return this.currentPlayerIndex + 1 === 4 ? 0 : this.currentPlayerIndex + 1;
  // }

  // public currentPlayerRollDice(): void {
  //   console.log(`Bijoya game.ts[ln:142] currentPlayerRollDice()`);
  //   this.currentPlayer.rollDice(this.dice);
  // }

  // private onFirstPlayerDeterminerUpdate(firstPlayerIndex: number): void {
  //   this.isDeterminingFirstPlayer = firstPlayerIndex === -1;

  //   return this.isDeterminingFirstPlayer
  //     ? this.nextTurn()
  //     : this.nextTurn(firstPlayerIndex);
  // }

  // private nextTurn(playerIndex: number = this.nextPlayerIndex()): void {
  //   console.log(`Bijoya game.ts[ln:160] nextTurn`, playerIndex);
  //   this._currentPlayerIndex = playerIndex;
  // }

  // private onTurnUpdated(turn?: Turn): void {
  //   console.log(`Bijoya game.ts[ln:135] onTurnUpdated()`, turn);
  //   if (!this.isDeterminingFirstPlayer && turn) {
  //     return this.letPlayerExecuteActionFollowingDiceRoll();
  //   }
  // }

  // public letPlayerExecuteActionFollowingDiceRoll(): void {
  //   console.log(
  //     `Bijoya game.ts[ln:153] letPlayerExecuteActionFollowingDiceRoll()`
  //   );
  //   switch (this.diceRollActionDeterminer.determineAction(this.currentPlayer)) {
  //     case DiceRollAction.MovePawnToStart:
  //       this.currentPlayerMovePawnToStartField();
  //       break;
  //     case DiceRollAction.MovePawnFromStart:
  //       this.currentPlayerMovePawnFromStartField();
  //       break;
  //     case DiceRollAction.DoNothing:
  //       this.nextTurn();
  //       break;
  //   }
  // }

  // private currentPlayerMovePawnToStartField(): void {
  //   this.currentPlayer.movePawnToStartField();
  // }

  // private currentPlayerMovePawnFromStartField(): void {
  //   this.currentPlayer.movePawnFromStartField();
  //   this.nextTurn();
  // }

  // public currentPlayerMovePawn(pawn: Pawn): void {
  //   if (this.currentPlayer.turn$) {
  //     this.currentPlayer.movePawn(pawn);
  //     this.nextTurn();
  //   }
  // }
}
