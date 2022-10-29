import { Board } from "./board";
import { allColors, Color } from "./color";
import { Dice } from "./dice";
import { FirstPlayerDeterminer } from "./first-player-determiner";
import { Pawn } from "./pawn";
import { Player } from "./player";

export class Game {
  readonly dice = new Dice();
  readonly board = new Board();

  players: Player[] = [];
  currentPlayerIndex = 0;
  isFirstPlayerDetermined = false;

  constructor(
    private readonly firstPlayerDeterminer = new FirstPlayerDeterminer()
  ) {
    this.createPlayers();
    this.placePawnsOnHomeFields()
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

  private placePawnsOnHomeFields() {
    const pawnsOfPlayers = this.players.map((player) => player.pawns);
    pawnsOfPlayers.forEach((pawns) => {
      this.board.homeFields.get(pawns[0].color)?.forEach((homeField, i) => {
        homeField.pawn = pawns[i];
        pawns[i].field = homeField;
      });
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
