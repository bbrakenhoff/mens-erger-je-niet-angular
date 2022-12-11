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
      this.mapPlayersToDiceRolls(players)
    ).pipe(
      takeWhile(
        (diceRolls: number[]) => !this.isAbleToDetermineFirstPlayer(diceRolls),
        true
      ),
      map((diceRolls: number[]) => {
        console.log(`🐝 first-player-determiner.ts[ln:35] find first index!`);
        return this.isAbleToDetermineFirstPlayer(diceRolls)
          ? this.determineFirstPlayerIndex(diceRolls)
          : -1;
      }),
      startWith(-1)
    );
  }

  private mapPlayersToDiceRolls(
    players: readonly Player[]
  ): readonly Observable<number>[] {
    return players.map((player) =>
      player.turn$.pipe(
        filter((turn) => turn !== undefined),
        map((turn?: Turn) => turn as Turn), // Is not optional anymore after filtering
        map((turn: Turn) => turn.diceRoll),
        tap((diceRoll) =>
          console.log(
            `🐝 first-player-determiner.ts[ln:45] map to diceroll`,
            diceRoll
          )
        )
      )
    );
  }

  // private mapTurnToDiceRolls(turns: Turn[]): number[] {
  //   return turns.map((turn) => turn.diceRoll);
  // }

  private isAbleToDetermineFirstPlayer(diceRollsOfPlayers: number[]): boolean {
    console.log(
      `🐝 first-player-determiner.ts[ln:56] isAbleToDetermineFirstPlayer()`
    );
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
