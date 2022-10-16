import { allColors, Color } from './color';
import { Dice } from './dice';
import { Pawn } from './pawn';
import { Player } from './player';

export class Game {
  players: Player[] = [];
  readonly dice = new Dice();
  currentPlayerIndex = 0;

  constructor() {
    this.createPlayers();
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
}
