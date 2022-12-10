import {
  combineLatest,
  filter,
  map,
  Observable,
  startWith,
  takeWhile
} from 'rxjs';
import { Player } from './player';
import { Turn } from './turn';

export class FirstPlayerDeterminer {
  public readonly firstPlayerIndex$: Observable<number>;

  public constructor(players: readonly Player[]) {
    this.firstPlayerIndex$ = combineLatest(
      this.mapPlayersToTurns(players)
    ).pipe(
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
  ): readonly Observable<Turn>[] {
    return players.map(
      (player) =>
        player.turn$.pipe(filter((turn?: Turn) => !!turn)) as Observable<Turn>
    );
  }

  private mapTurnToDiceRolls(turns: readonly Turn[]): readonly number[] {
    console.log(
      `Bijoya first-player-determiner.ts[ln:43] mapTurnToDiceRolls()`
    );
    return turns.map((turn) => turn.diceRoll);
  }

  private isAbleToDetermineFirstPlayer(
    diceRollsOfPlayers: readonly number[]
  ): boolean {
    console.log(
      `Bijoya first-player-determiner.ts[ln:49] isAbleToDetermineFirstPlayer()`
    );
    return (
      this.didAllPlayersRollTheDice(diceRollsOfPlayers) &&
      this.isHighestDiceRollOnlyOnce(diceRollsOfPlayers)
    );
  }

  private didAllPlayersRollTheDice(
    diceRollsOfPlayers: readonly number[]
  ): boolean {
    return diceRollsOfPlayers.every((diceRoll) => diceRoll > -1);
  }

  private isHighestDiceRollOnlyOnce(
    diceRollsOfPlayers: readonly number[]
  ): boolean {
    return (
      diceRollsOfPlayers.filter(
        (diceRoll: number) =>
          diceRoll === this.getHighestDiceRoll(diceRollsOfPlayers)
      ).length === 1
    );
  }

  private getHighestDiceRoll(diceRollsOfPlayers: readonly number[]): number {
    return Math.max(...diceRollsOfPlayers);
  }

  private determineFirstPlayerIndex(diceRolls: readonly number[]): number {
    return diceRolls.indexOf(this.getHighestDiceRoll(diceRolls));
  }
}
