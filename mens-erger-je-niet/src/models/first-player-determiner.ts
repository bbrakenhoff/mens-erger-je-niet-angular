import { Player } from './player';

export class FirstPlayerDeterminer {
  private _firstPlayerIndex = -1;
  public get firstPlayerIndex(): number {
    return this._firstPlayerIndex;
  }

  public determineFirstPlayer(players: readonly Player[]): void {
    const diceRollsOfPlayers = this.getDiceRollsOfPlayers(players);
    if (this.isAbleToDetermineFirstPlayer(diceRollsOfPlayers)) {
      this._firstPlayerIndex = diceRollsOfPlayers.indexOf(
        this.getHighestDiceRollBetweenPlayers(diceRollsOfPlayers)
      );
    }
  }

  private isAbleToDetermineFirstPlayer(diceRollsOfPlayers: number[]): boolean {
    return (
      !this.isFirstPlayerAlreadyDetermined() &&
      this.didAllPlayersRollTheDice(diceRollsOfPlayers) &&
      this.isHighestDiceRollOnlyOnce(diceRollsOfPlayers)
    );
  }

  public isFirstPlayerAlreadyDetermined(): boolean {
    return this.firstPlayerIndex > -1;
  }

  private didAllPlayersRollTheDice(diceRollsOfPlayers: number[]): boolean {
    return diceRollsOfPlayers.length === 4;
  }

  private isHighestDiceRollOnlyOnce(
    diceRollsOfPlayers: readonly number[]
  ): boolean {
    return (
      diceRollsOfPlayers.filter(
        (diceRoll: number) =>
          diceRoll === this.getHighestDiceRollBetweenPlayers(diceRollsOfPlayers)
      ).length === 1
    );
  }

  private getDiceRollsOfPlayers(players: readonly Player[]): number[] {
    return players
      .map((player) => player.latestDiceRoll)
      .filter((diceRoll) => diceRoll) as number[];
  }

  private getHighestDiceRollBetweenPlayers(
    diceRollsOfPlayers: readonly number[]
  ): number {
    return Math.max(...diceRollsOfPlayers);
  }
}
