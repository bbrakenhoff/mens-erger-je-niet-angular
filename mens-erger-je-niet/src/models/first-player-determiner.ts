import { Player } from './player';

export class FirstPlayerDeterminer {
  private firstPlayerIndex = -1;

  determineFirstPlayer(players: Player[], currentPlayerIndex: number) {
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
  ) {
    return (
      !this.isFirstPlayerAlreadyDetermined() &&
      this.didAllPlayersRollTheDice(currentPlayerIndex) &&
      this.isHighestDiceRollOnlyOnce(diceRollsOfPlayers)
    );
  }

  isFirstPlayerAlreadyDetermined() {
    return this.firstPlayerIndex > -1;
  }

  private didAllPlayersRollTheDice(currentPlayerIndex: number) {
    return currentPlayerIndex === 3;
  }

  private isHighestDiceRollOnlyOnce(diceRollsOfPlayers: number[]) {
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

  private getHighestDiceRollBetweenPlayers(diceRollsOfPlayers: number[]) {
    return Math.max(...diceRollsOfPlayers);
  }
}
