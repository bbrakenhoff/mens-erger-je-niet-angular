import { Observable, Subject } from 'rxjs';
import { Board } from './board';
import { allColors } from './color';
import { Dice } from './dice';
import { FirstPlayerDeterminer } from './first-player-determiner';
import { GameEventMessage } from './game-event-message';
import { Pawn } from './pawn';
import { Player } from './player';
import { Turn } from './turn';

export class Game {
  private readonly gameEventMessage: GameEventMessage = {
    text: ``,
    subtext: ``,
  };
  private readonly _gameEventMessage$$ = new Subject<GameEventMessage>();
  public get gameEventMessage$(): Observable<GameEventMessage> {
    return this._gameEventMessage$$.asObservable();
  }
  private isDeterminingFirstPlayer = true;

  private readonly turn: Turn = {
    playerIndex: 0,
    hasRolledDice: false,
    isPlayerPuttingPawnOnStartField: false,
  };

  public get currentPlayerIndex(): number {
    return this.turn.playerIndex;
  }
  public constructor(
    private readonly dice = new Dice(),
    public readonly board = new Board(),
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

  private nextTurn(playerIndex: number = this.nextPlayerIndex()): void {
    this.turn.playerIndex = playerIndex;
    this.turn.hasRolledDice = false;
    this.turn.isPlayerPuttingPawnOnStartField = false;
  }

  private nextPlayerIndex(): number {
    return this.turn.playerIndex + 1 === 4 ? 0 : this.turn.playerIndex + 1;
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
    this.gameEventMessage.text = `Player ${
      this.currentPlayerIndex + 1
    } rolled ${this.currentPlayer.latestDiceRoll}`;

    this.turn.hasRolledDice = true;
    if (this.isDeterminingFirstPlayer) {
      this.tryDeterminingFirstPlayer();
    } else if (this.currentPlayerShouldMovePawnOnStartField()) {
      this.currentPlayerMovePawnToStartField();
    } else if (this.turn.isPlayerPuttingPawnOnStartField) {
      this.currentPlayerMovePawnFromStartField();
    } else if (!this.currentPlayer.hasPawnsToMove()) {
      this.gameEventMessage.subtext = `Player ${
        this.currentPlayerIndex + 1
      } does not have pawns to move; player ${
        this.nextPlayerIndex() + 1
      } may roll the dice`;
      this.updateGameEventMessage();
      this.nextTurn();
    }
  }

  private currentPlayerShouldMovePawnOnStartField(): boolean {
    return (
      !this.turn.isPlayerPuttingPawnOnStartField &&
      this.currentPlayer.latestDiceRoll === 6
    );
  }

  private tryDeterminingFirstPlayer(): void {
    if (this.determineFirstPlayer()) {
      this.gameEventMessage.subtext = `Player ${
        this.firstPlayerDeterminer.firstPlayerIndex + 1
      } may start!`;
      this.nextTurn(this.firstPlayerDeterminer.firstPlayerIndex);
      this.isDeterminingFirstPlayer = false;
    } else {
      this.gameEventMessage.subtext = `First player not yet determined, Player ${
        this.nextPlayerIndex() + 1
      } may roll the dice`;
      this.nextTurn();
    }

    this.updateGameEventMessage();
  }

  private updateGameEventMessage(): void {
    this._gameEventMessage$$.next(this.gameEventMessage);
  }

  private currentPlayerMovePawnToStartField(): void {
    this.currentPlayer.movePawnToStartField();
    this.turn.hasRolledDice = false;
    this.turn.isPlayerPuttingPawnOnStartField = true;
    this.gameEventMessage.text = `Player ${
      this.currentPlayerIndex + 1
    } moved a pawn to start`;
    this.gameEventMessage.subtext = `Player ${
      this.currentPlayerIndex + 1
    } may roll the dice again`;
    this.updateGameEventMessage();
  }

  private currentPlayerMovePawnFromStartField(): void {
    this.currentPlayer.movePawnFromStartField();
    this.gameEventMessage.text = `Player ${
      this.currentPlayerIndex + 1
    } moved a pawn on start`;
    this.gameEventMessage.subtext = `Player ${
      this.currentPlayerIndex + 1
    } may roll the dice again`;
    this.updateGameEventMessage();
    this.nextTurn();
  }

  public currentPlayerMovePawn(pawn: Pawn): void {
    if (this.turn.hasRolledDice) {
      this.currentPlayer.movePawn(pawn);
      this.gameEventMessage.text = `Player ${
        this.currentPlayerIndex + 1
      } moved a pawn`;
      this.gameEventMessage.subtext = `Player ${
        this.nextPlayerIndex() + 1
      } may roll the dice`;
      this.updateGameEventMessage();
      this.nextTurn();
    }
  }
}
