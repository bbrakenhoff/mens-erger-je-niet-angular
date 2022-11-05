import { Player } from './player';

export class FirstPlayerDeterminer {
  private firstPlayerIndex = -1;

  public determineFirstPlayer(
    players: Player[],
    currentPlayerIndex: number
  ): number {
    const diceRollsOfPlayers = this.getDiceRollsOfPlayers(players);
    if (
      this.isAbleToDetermineFirstPlayer(diceRollsOfPlayers, currentPlayerIndex)
    ) {
      this.firstPlayerIndex = diceRollsOfPlayers.indexOf(
        this.getHighestDiceRollBetweenPlayers(diceRollsOfPlayers)
      );
    }
    return this.firstPlayerIndex;
  }

  private isAbleToDetermineFirstPlayer(
    diceRollsOfPlayers: number[],
    currentPlayerIndex: number
  ): boolean {
    return (
      !this.isFirstPlayerAlreadyDetermined() &&
      this.didAllPlayersRollTheDice(currentPlayerIndex) &&
      this.isHighestDiceRollOnlyOnce(diceRollsOfPlayers)
    );
  }

  private isFirstPlayerAlreadyDetermined(): boolean {
    return this.firstPlayerIndex > -1;
  }

  private didAllPlayersRollTheDice(currentPlayerIndex: number): boolean {
    return currentPlayerIndex === 3;
  }

  private isHighestDiceRollOnlyOnce(diceRollsOfPlayers: number[]): boolean {
    return (
      diceRollsOfPlayers.filter(
        (diceRoll: number) =>
          diceRoll === this.getHighestDiceRollBetweenPlayers(diceRollsOfPlayers)
      ).length === 1
    );
  }

  private getDiceRollsOfPlayers(players: Player[]): number[] {
    return players.map((player) => player.latestDiceRoll);
  }

  private getHighestDiceRollBetweenPlayers(
    diceRollsOfPlayers: number[]
  ): number {
    return Math.max(...diceRollsOfPlayers);
  }
}
