import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  of,
  skip,
  startWith,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs';
import { Dice } from './dice';
import { Player } from './player';
import { Turn } from './turn';

export class FirstPlayerDeterminer {
  public readonly firstPlayerIndex$: Observable<number>;

  private readonly _currentPlayerIndex$$ = new BehaviorSubject(-1);
  public readonly currentPlayerIndex$ =
    this._currentPlayerIndex$$.asObservable();

  public readonly currentPlayerDiceRoll$ = this.currentPlayerIndex$.pipe(
    skip(1),
    switchMap((currentPlayerIndex) =>
      combineLatest([of(currentPlayerIndex), this.currentPlayer.turn$])
    ),
    tap((r) =>
      console.log(`🐝 first-player-determiner.ts[ln:30] tap tap tap`, r)
    ),
    map(([playerIndex, turn]) => ({
      playerIndex,
      diceRoll: turn ? turn.diceRoll : -1,
    }))
  );

  public constructor(
    private readonly players: readonly Player[] = [
      new Player(),
      new Player(),
      new Player(),
      new Player(),
    ],
    private readonly dice = new Dice()
  ) {
    this.firstPlayerIndex$ = combineLatest(
      this.mapPlayersToDiceRolls(players)
    ).pipe(
      takeWhile(
        (diceRolls: number[]) => !this.isAbleToDetermineFirstPlayer(diceRolls),
        true
      ),
      map((diceRolls: number[]) => {
        return this.isAbleToDetermineFirstPlayer(diceRolls)
          ? this.determineFirstPlayerIndex(diceRolls)
          : -1;
      }),
      startWith(-1)
    );
  }

  private get currentPlayer(): Player {
    return this.players[this._currentPlayerIndex$$.value];
  }

  private mapPlayersToDiceRolls(
    players: readonly Player[]
  ): readonly Observable<number>[] {
    return players.map((player) =>
      player.turn$.pipe(
        filter((turn) => !!turn),
        map((turn?: Turn) => turn as Turn), // Is not optional anymore after filtering
        map((turn: Turn) => turn.diceRoll)
      )
    );
  }

  private isAbleToDetermineFirstPlayer(diceRollsOfPlayers: number[]): boolean {
    return (
      this.didAllPlayersRollTheDice(diceRollsOfPlayers) &&
      this.isHighestDiceRollOnlyOnce(diceRollsOfPlayers)
    );
  }

  private didAllPlayersRollTheDice(diceRollsOfPlayers: number[]): boolean {
    return diceRollsOfPlayers.every((diceRoll) => diceRoll > -1);
  }

  private isHighestDiceRollOnlyOnce(diceRollsOfPlayers: number[]): boolean {
    return (
      diceRollsOfPlayers.filter(
        (diceRoll: number) =>
          diceRoll === this.getHighestDiceRoll(diceRollsOfPlayers)
      ).length === 1
    );
  }

  private getHighestDiceRoll(diceRollsOfPlayers: number[]): number {
    return Math.max(...diceRollsOfPlayers);
  }

  private determineFirstPlayerIndex(diceRolls: number[]): number {
    return diceRolls.indexOf(this.getHighestDiceRoll(diceRolls));
  }

  public currentPlayerRollDice(): void {
    if (this.currentPlayer) {
      // Needed because player index is -1 at the start
      this.currentPlayer.endTurn();
    }
    this._currentPlayerIndex$$.next(this.getNextPlayerIndex());
    this.currentPlayer.startTurn();
    this.currentPlayer.rollDice(this.dice);
  }

  private getNextPlayerIndex(): number {
    let nextPlayerIndex = this._currentPlayerIndex$$.value + 1;
    if (nextPlayerIndex === 4) {
      nextPlayerIndex = 0;
    }

    return nextPlayerIndex;
  }
}
