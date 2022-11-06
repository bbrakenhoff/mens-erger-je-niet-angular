import { Board } from './board';
import { allColors, Color } from './color';
import { Dice } from './dice';
import { HomeField } from './fields/home-field';
import { StartField } from './fields/start-field';
import { FirstPlayerDeterminer } from './first-player-determiner';
import { Pawn } from './pawn';
import { Player } from './player';

export class Game {
  public readonly dice = new Dice();
  public readonly board = new Board();

  public players: Player[] = [];
  public currentPlayerIndex = 0;
  private gameStarted = false;
  private isCurrentPlayerPuttingPawnOnStartField = false;

  public constructor(
    private readonly firstPlayerDeterminer = new FirstPlayerDeterminer()
  ) {
    this.createPlayers();
    this.placePawnsOnHomeFields();
  }

  public get currentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  private createPlayers(): void {
    allColors.forEach((color: Color) => {
      const pawns: Pawn[] = [];
      for (let i = 0; i < 4; i++) {
        pawns.push(new Pawn(color));
      }

      this.players.push(new Player(pawns));
    });
  }

  private placePawnsOnHomeFields(): void {
    const pawnsOfPlayers = this.players.map((player) => player.pawns);
    pawnsOfPlayers.forEach((pawns) => {
      this.board.homeFields.get(pawns[0].color)?.forEach((homeField, i) => {
        homeField.pawn = pawns[i];
        pawns[i].field = homeField;
      });
    });
  }

  public nextPlayer(): void {
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
      // TODO: move another pawn
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
    const pawnOnHomeField = this.currentPlayer.pawns.find(
      (pawn) => pawn.field instanceof HomeField
    );
    pawnOnHomeField?.moveToNextField();
    this.isCurrentPlayerPuttingPawnOnStartField = true;
  }

  private currentPlayerMovePawnFromStartField(): void {
    const pawnOnStartField = this.currentPlayer.pawns.find(
      (pawn) => pawn.field instanceof StartField
    );
    if (pawnOnStartField) {
      pawnOnStartField?.moveToNextField();
      this.isCurrentPlayerPuttingPawnOnStartField = false;
    }
  }
}
