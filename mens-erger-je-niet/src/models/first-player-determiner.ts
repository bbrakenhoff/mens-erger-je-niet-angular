import {
  combineLatest,
  filter,
  map,
  Observable,
  startWith,
  takeWhile,
  tap,
} from 'rxjs';
import { Player } from './player';
import { Turn } from './turn';

export class FirstPlayerDeterminer {
  public readonly firstPlayerIndex$: Observable<number>;

  public constructor(players: readonly Player[]) {
    this.firstPlayerIndex$ = combineLatest(
      this.mapPlayersToTurns(players)
    ).pipe(
      tap((turns) =>
        console.log(`🐝 first-player-determiner.ts[ln:19] 1`, turns)
      ),
      map((turns: (Turn | undefined)[]) => turns as Turn[]),
      map((turns: Turn[]) => this.mapTurnToDiceRolls(turns)),
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

  private mapPlayersToTurns(
    players: readonly Player[]
  ): readonly Observable<Turn | undefined>[] {
    return players.map((player) =>
      player.turn$.pipe(filter((turn) => turn !== undefined))
    );
  }

  private mapTurnToDiceRolls(turns: Turn[]): number[] {
    return turns.map((turn) => turn.diceRoll);
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
}
