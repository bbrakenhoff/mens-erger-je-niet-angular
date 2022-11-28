import { BehaviorSubject, Observable } from 'rxjs';
import { GameEvent, GameEventInfo } from '../app/game-event-message';
import { Board } from './board';
import { allColors } from './color';
import { Dice } from './dice';
import { FirstPlayerDeterminer } from './first-player-determiner';
import { Pawn } from './pawn';
import { Player } from './player';
import { Turn } from './turn';

export class Game {
  private readonly _gameEvent$$: BehaviorSubject<{
    event: GameEvent;
    info: GameEventInfo;
  }>;
  public get gameEvent$(): Observable<{
    event: GameEvent;
    info: GameEventInfo;
  }> {
    return this._gameEvent$$.asObservable();
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

    const gameNotStartedEvent = {
      event: GameEvent.GameNotStartedYet,
      info: {
        currentPlayerIndex: this.turn.playerIndex,
        latestDiceRoll: this.players[this.turn.playerIndex].latestDiceRoll,
      } as GameEventInfo,
    };
    this._gameEvent$$ = new BehaviorSubject(gameNotStartedEvent);
    this.updateGameEvent(GameEvent.GameNotStartedYet);
  }

  private updateGameEvent(
    event: GameEvent,
    nextPlayerIndex = this.nextPlayerIndex()
  ): void {
    this._gameEvent$$.next({
      event,
      info: {
        currentPlayerIndex: this.turn.playerIndex,
        nextPlayerIndex,
        latestDiceRoll: this.players[this.turn.playerIndex].latestDiceRoll,
      },
    });
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

  private nextPlayerIndex(): number {
    return this.turn.playerIndex + 1 === 4 ? 0 : this.turn.playerIndex + 1;
  }

  public currentPlayerRollDice(): void {
    this.currentPlayer.rollDice(this.dice);
    this.handleRulesFollowingDiceRoll();
  }

  private handleRulesFollowingDiceRoll(): void {
    this.turn.hasRolledDice = true;
    if (this.isDeterminingFirstPlayer) {
      this.tryDeterminingFirstPlayer();
    } else if (this.currentPlayerShouldMovePawnOnStartField()) {
      this.currentPlayerMovePawnToStartField();
    } else if (this.turn.isPlayerPuttingPawnOnStartField) {
      this.currentPlayerMovePawnFromStartField();
    } else if (!this.currentPlayer.hasPawnsToMove()) {
      this.updateGameEvent(GameEvent.CurrentPlayerHasNoPawnsToMove);
      this.nextTurn();
    }
  }

  private tryDeterminingFirstPlayer(): void {
    if (this.determineFirstPlayer()) {
      this.updateGameEvent(
        GameEvent.FirstPlayerDetermined,
        this.firstPlayerDeterminer.firstPlayerIndex
      );
      this.nextTurn(this.firstPlayerDeterminer.firstPlayerIndex);
      this.isDeterminingFirstPlayer = false;
    } else {
      this.updateGameEvent(GameEvent.DetermineFirstPlayerFailed);
      this.nextTurn();
    }
  }

  private determineFirstPlayer(): boolean {
    this.firstPlayerDeterminer.determineFirstPlayer(
      this.players,
      this.currentPlayerIndex
    );

    return this.firstPlayerDeterminer.isFirstPlayerAlreadyDetermined();
  }

  private nextTurn(playerIndex: number = this.nextPlayerIndex()): void {
    this.turn.playerIndex = playerIndex;
    this.turn.hasRolledDice = false;
    this.turn.isPlayerPuttingPawnOnStartField = false;
  }

  private currentPlayerShouldMovePawnOnStartField(): boolean {
    return (
      !this.turn.isPlayerPuttingPawnOnStartField &&
      this.currentPlayer.latestDiceRoll === 6
    );
  }

  private currentPlayerMovePawnToStartField(): void {
    this.currentPlayer.movePawnToStartField();
    this.turn.hasRolledDice = false;
    this.turn.isPlayerPuttingPawnOnStartField = true;

    this.updateGameEvent(GameEvent.CurrentPlayerMovedPawnToStartField);
  }

  private currentPlayerMovePawnFromStartField(): void {
    this.currentPlayer.movePawnFromStartField();
    this.updateGameEvent(GameEvent.CurrentPlayerMovedPawnFromStartField);
    this.nextTurn();
  }

  public currentPlayerMovePawn(pawn: Pawn): void {
    if (this.turn.hasRolledDice) {
      this.currentPlayer.movePawn(pawn);
      this.updateGameEvent(GameEvent.CurrentPlayerMovedPawn);
      this.nextTurn();
    }
  }
}
