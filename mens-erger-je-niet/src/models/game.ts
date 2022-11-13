import { Board } from './board';
import { allColors, Color } from './color';
import { Dice } from './dice';
import { FirstPlayerDeterminer } from './first-player-determiner';
import { Pawn } from './pawn';
import { Player } from './player';

export class Game {
  public readonly dice = new Dice();
  public readonly board = new Board();

  public currentPlayerIndex = 0;
  private gameStarted = false;
  private isCurrentPlayerPuttingPawnOnStartField = false;

  public constructor(
    public readonly players: Player[] = [
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

  private createPawns(): Map<Color, Pawn[]> {
    const allPawnsInGame = new Map<Color, Pawn[]>();
    allColors.forEach((color) => {
      const pawns = [];
      for (let i = 0; i < 4; i++) {
        pawns.push(new Pawn(color));
      }
      allPawnsInGame.set(color, pawns);
    });

    return allPawnsInGame;
  }

  private letPlayersPutPawnsOnHomeFields(): void {
    const allPawnsInGame = this.createPawns();
    this.players.forEach((player, i) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      player.pawns.push(...allPawnsInGame.get(allColors[i])!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      player.putPawnsOnHomeFields(this.board.homeFields.get(allColors[i])!);
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
