import { allColors, Color } from './color';
import { Dice } from './dice';
import { FirstPlayerDeterminer } from './first-player-determiner';
import { Pawn } from './pawn';
import { Player } from './player';

export class Game {
  players: Player[] = [];
  readonly dice = new Dice();
  currentPlayerIndex = 0;
  isFirstPlayerDetermined = false;

  constructor(
    private readonly firstPlayerDeterminer = new FirstPlayerDeterminer()
  ) {
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

    this.firstPlayerDeterminer.determineFirstPlayer(
      this.players,
      this.currentPlayerIndex
    );
    
    if (!this.firstPlayerDeterminer.isFirstPlayerAlreadyDetermined()) {
      this.nextPlayer();
    }
  }
}
