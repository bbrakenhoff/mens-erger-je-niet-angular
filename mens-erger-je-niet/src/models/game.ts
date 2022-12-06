import { BehaviorSubject, filter, merge, Observable } from 'rxjs';
import { GameEvent, GameEventInfo } from '../app/game-event-message';
import { Board } from './board';
import { allColors } from './color';
import { Dice } from './dice';
import { DiceRollAction } from './dice-roll-action';
import { DiceRollActionDeterminer } from './dice-roll-action-determiner';
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

  private _currentPlayerIndex = 0;
  public get currentPlayerIndex(): number {
    return this._currentPlayerIndex;
  }

  private set currentPlayerIndex(value: number) {
    this.currentPlayer.endTurn();
    this._currentPlayerIndex = value;
    this.currentPlayer.startTurn();
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
    private readonly firstPlayerDeterminer = new FirstPlayerDeterminer(players),
    private readonly diceRollActionDeterminer = new DiceRollActionDeterminer()
  ) {
    this.firstPlayerDeterminer.firstPlayerIndex$.subscribe({
      next: (firstPlayerIndex) =>
        this.onFirstPlayerDeterminerUpdate(firstPlayerIndex),
    });
    merge(...this.players.map((player) => player.turn$)).subscribe({
      next: (turn?: Turn) => this.onTurnUpdated(turn),
    });

    // this.players.forEach((player) => {
    //   player.turn$.subscribe(this.turnObserver);
    // });

    this.letPlayersPutPawnsOnHomeFields();

    this.nextTurn(0);
    const gameNotStartedEvent = {
      event: GameEvent.GameNotStartedYet,
      info: {
        currentPlayerIndex: this._currentPlayerIndex,
        // latestDiceRoll: this.players[this._currentPlayerIndex].turn$,
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
        currentPlayerIndex: this._currentPlayerIndex,
        nextPlayerIndex,
        // latestDiceRoll: this.players[this._currentPlayerIndex].turn$.,
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
    return this._currentPlayerIndex + 1 === 4
      ? 0
      : this._currentPlayerIndex + 1;
  }

  public currentPlayerRollDice(): void {
    this.currentPlayer.rollDice(this.dice);
  }

  private onFirstPlayerDeterminerUpdate(firstPlayerIndex: number): void {
    this.isDeterminingFirstPlayer = firstPlayerIndex === -1;
    if (this.isDeterminingFirstPlayer) {
      this.nextTurn();
    } else {
      this.nextTurn(firstPlayerIndex);
    }
    console.log(
      `%cBijoya game.ts[ln:129] onFirstPlayerDeterminerUpdate()`,
      'color: deeppink',
      this.isDeterminingFirstPlayer
    );
  }

  private nextTurn(playerIndex: number = this.nextPlayerIndex()): void {
    this.currentPlayerIndex = playerIndex;
  }

  private onTurnUpdated(turn?: Turn): void {
    console.log(`Bijoya game.ts[ln:135] onTurnUpdated()`, turn);
    if (!this.isDeterminingFirstPlayer && turn) {
      return this.letPlayerExecuteActionFollowingDiceRoll();
    }
  }

  public letPlayerExecuteActionFollowingDiceRoll(): void {
    console.log(`Bijoya game.ts[ln:153] letPlayerExecuteActionFollowingDiceRoll()`)
    switch (this.diceRollActionDeterminer.determineAction(this.currentPlayer)) {
      case DiceRollAction.MovePawnToStart:
        this.currentPlayerMovePawnToStartField();
        break;
      case DiceRollAction.MovePawnFromStart:
        this.currentPlayerMovePawnFromStartField();
        break;
      case DiceRollAction.DoNothing:
        this.nextTurn();
        break;
    }
  }

  private currentPlayerMovePawnToStartField(): void {
    this.updateGameEvent(GameEvent.CurrentPlayerMovedPawnToStartField);
    this.currentPlayer.movePawnToStartField();
  }

  private currentPlayerMovePawnFromStartField(): void {
    this.updateGameEvent(GameEvent.CurrentPlayerMovedPawnFromStartField);
    this.currentPlayer.movePawnFromStartField();
    this.nextTurn();
  }

  public currentPlayerMovePawn(pawn: Pawn): void {
    if (this.currentPlayer.turn$) {
      this.updateGameEvent(GameEvent.CurrentPlayerMovedPawn);
      this.currentPlayer.movePawn(pawn);
      this.nextTurn();
    }
  }
}
