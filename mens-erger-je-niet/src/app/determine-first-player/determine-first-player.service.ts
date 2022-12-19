import { Inject, Injectable } from '@angular/core';
import { Dice } from 'models/dice';
import { Player } from 'models/player';
import { Turn } from 'models/turn';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  pairwise,
  startWith,
  takeWhile
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetermineFirstPlayerService {
  public readonly firstPlayerIndex$ = combineLatest(
    this.mapPlayersToDiceRolls()
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

  private readonly _currentPlayerIndex$$ = new BehaviorSubject(-1);
  public readonly currentPlayerIndex$ =
    this._currentPlayerIndex$$.asObservable();

  public readonly diceRolls$ = combineLatest(
    this.mapPlayersToDiceRollsPairwise()
  ).pipe(
    map((diceRolls) =>
      diceRolls.map((diceRoll, playerIndex) => ({
        playerIndex,
        diceRoll,
      }))
    ),
    pairwise(),
    filter(
      ([previous, current]) =>
        this.somePlayerRolledDice(previous, current) ||
        this.noPlayersRolledDice(previous, current)
    ),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map(([previous, current]) => current)
  );

  public constructor(
    @Inject('Players')
    private readonly players: readonly Player[],
    @Inject('Dice')
    private readonly dice: Dice
  ) {}

  private noPlayersRolledDice(
    previous: { playerIndex: number; diceRoll: number }[],
    current: { playerIndex: number; diceRoll: number }[]
  ): boolean {
    return (
      previous.every((diceRoll) => diceRoll.diceRoll === -1) &&
      current.every((diceRoll) => diceRoll.diceRoll === -1)
    );
  }

  /**
   * Check if any of the players have rolled the dice,
   * make sure to exclude start and end turn
   * @param previous
   * @param current
   * @returns
   */
  private somePlayerRolledDice(
    previous: { playerIndex: number; diceRoll: number }[],
    current: { playerIndex: number; diceRoll: number }[]
  ): boolean {
    return JSON.stringify(previous) !== JSON.stringify(current);
  }

  private get currentPlayer(): Player {
    return this.players[this._currentPlayerIndex$$.value];
  }

  private mapPlayersToDiceRolls(): readonly Observable<number>[] {
    return this.players.map((player) =>
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

  private mapPlayersToDiceRollsPairwise(): Observable<number>[] {
    return this.players.map((player) =>
      player.turn$.pipe(
        map((turn: Turn | undefined) => (turn ? turn.diceRoll : -1)),
        startWith(-1),
        pairwise(),
        map(([previousDiceRoll, currentDiceRoll]) =>
          this.rememberDiceRoll(previousDiceRoll, currentDiceRoll)
            ? previousDiceRoll
            : currentDiceRoll
        )
      )
    );
  }

  private rememberDiceRoll(
    previousDiceRoll: number,
    currentDiceRoll: number
  ): boolean {
    return previousDiceRoll > -1 && currentDiceRoll === -1;
  }
}
