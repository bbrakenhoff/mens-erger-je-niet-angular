import { Board } from './board';
import { allColors } from './color';
import { Dice } from './dice';
import { FirstPlayerDeterminer } from './first-player-determiner';
import { Pawn } from './pawn';
import { Player } from './player';

export class Game {
  

  public currentPlayerIndex = 0;
  private gameStarted = false;
  private isCurrentPlayerPuttingPawnOnStartField = false;

  public constructor(
    private readonly dice = new Dice(),
    private readonly board = new Board(),
    public readonly players: readonly Player[] = [
      new Player(),
      new Player(),
      new Player(),
      new Player(),
    ],
    private readonly firstPlayerDeterminer = new FirstPlayerDeterminer()
  ) {
    this.letPlayersPutPawnsOnHomeFields();
  }

  public get currentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
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
    const allPawnsInGame: readonly Pawn[][] = Game.createPawns();
    allPawnsInGame.forEach((pawns: Pawn[], i) => {
      const matchingHomeFields = this.board.getFieldGroupByColor(
        pawns[0].color
      ).homeFields;
      this.players[i].pawns.push(...pawns);
      this.players[i].putPawnsOnHomeFields(matchingHomeFields);
    });
  }

  private nextPlayer(): void {
    this.currentPlayerIndex++;

    if (this.currentPlayerIndex === 4) {
      this.currentPlayerIndex = 0;
    }
  }
  private determineFirstPlayer(): boolean {
    this.firstPlayerDeterminer.determineFirstPlayer(
      this.players,
      this.currentPlayerIndex
    );

    return this.firstPlayerDeterminer.isFirstPlayerAlreadyDetermined();
  }
  public currentPlayerRollDice(): void {
    this.currentPlayer.rollDice(this.dice);
    this.handleRulesFollowingDiceRoll();
  }

  private handleRulesFollowingDiceRoll(): void {
    if (!this.gameStarted) {
      this.handleRulesFollowingDiceRollWhenGameNotStarted();
    } else if (this.currentPlayerShouldMovePawnOnStartField()) {
      this.currentPlayerMovePawnToStartField();
    } else if (this.isCurrentPlayerPuttingPawnOnStartField) {
      this.currentPlayerMovePawnFromStartField();
      this.nextPlayer();
    } else {
      if (!this.currentPlayer.hasPawnsToMove()) {
        this.nextPlayer();
      }
    }
  }

  private currentPlayerShouldMovePawnOnStartField(): boolean {
    return (
      !this.isCurrentPlayerPuttingPawnOnStartField &&
      this.currentPlayer.latestDiceRoll === 6
    );
  }

  private handleRulesFollowingDiceRollWhenGameNotStarted(): void {
    if (this.determineFirstPlayer()) {
      this.currentPlayerIndex = this.firstPlayerDeterminer.firstPlayerIndex;
      this.gameStarted = true;
    } else {
      this.nextPlayer();
    }
  }

  private currentPlayerMovePawnToStartField(): void {
    this.currentPlayer.movePawnToStartField();
    this.isCurrentPlayerPuttingPawnOnStartField = true;
  }

  private currentPlayerMovePawnFromStartField(): void {
    this.currentPlayer.movePawnFromStartField();
    this.isCurrentPlayerPuttingPawnOnStartField = false;
  }

  public currentPlayerMovePawn(pawn: Pawn): void {
    this.currentPlayer.movePawn(pawn);
  }
}
