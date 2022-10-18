import { allColors, Color } from './color';
import { Dice } from './dice';
import { Pawn } from './pawn';
import { Player } from './player';

export class Game {
  players: Player[] = [];
  readonly dice = new Dice();
  currentPlayerIndex = 0;
  isFirstPlayerDetermined = false;

  constructor() {
    this.createPlayers();
  }

  private get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  private createPlayers() {
    allColors.forEach((color: Color) => {
      const pawns: Pawn[] = [];
      for (let i = 0; i < 4; i++) {
        pawns.push(new Pawn(color));
      }

      this.players.push(new Player(pawns));
    });
  }

  nextPlayer() {
    this.currentPlayerIndex++;

    if (this.currentPlayerIndex === 4) {
      this.currentPlayerIndex = 0;
    }
  }

  currentPlayerRollDice() {
    this.currentPlayer.rollDice(this.dice);

    if (this.canDetermineFirstPlayer()) {
      this.findFirstPlayerIndex();
    } else {
      this.nextPlayer();
    }
  }

  private canDetermineFirstPlayer() {
    return (
      !this.isFirstPlayerDetermined &&
      this.currentPlayerIndex === 3 &&
      this.isHighestDiceRollOnlyOnce()
    );
  }

  private highestDiceRoll = 0;
  private diceRollsOfPlayers: number[] = [];

  private isHighestDiceRollOnlyOnce() {
    this.diceRollsOfPlayers = this.players.map(
      (player) => player.numberOfEyesRolledWithDice
    );

    this.highestDiceRoll = Math.max(...this.diceRollsOfPlayers);
    // console.log(
    //   `Bijoya game.ts[ln:64] ${this.diceRollsOfPlayers} > ${this.highestDiceRoll}`
    // );

    return (
      this.diceRollsOfPlayers.filter(
        (diceRoll) => diceRoll === this.highestDiceRoll
      ).length === 1
    );
  }

  private findFirstPlayerIndex() {
    this.isFirstPlayerDetermined = true;
    this.currentPlayerIndex = this.diceRollsOfPlayers.indexOf(
      this.highestDiceRoll
    );
    console.log(
      `Bijoya game.ts[ln:75] () ${this.diceRollsOfPlayers.indexOf(
        this.highestDiceRoll
      )} ${this.currentPlayerIndex}`
    );
  }
}
