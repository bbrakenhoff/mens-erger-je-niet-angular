import { allColors, Color } from './color';
import { Game } from './game';
import { Pawn } from './pawn';

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  describe('constructor()', () => {
    it('should create 4 players with 4 pawns each', () => {
      expect(game.players.length).toEqual(4);

      expect(game.players[0].pawns.length).toEqual(4);
      expect(
        game.players[0].pawns.every((pawn: Pawn) => pawn.color === Color.Black)
      );
      expect(game.players[1].pawns.length).toEqual(4);
      expect(
        game.players[1].pawns.every((pawn: Pawn) => pawn.color === Color.Green)
      );
      expect(game.players[2].pawns.length).toEqual(4);
      expect(
        game.players[2].pawns.every((pawn: Pawn) => pawn.color === Color.Red)
      );
      expect(game.players[3].pawns.length).toEqual(4);
      expect(
        game.players[3].pawns.every((pawn: Pawn) => pawn.color === Color.Yellow)
      );
    });
  });

  describe('nextPlayer()', () => {
    it('should update current player index', () => {
      expect(game.currentPlayerIndex).toEqual(0);
      game.nextPlayer();
      expect(game.currentPlayerIndex).toEqual(1);
      game.nextPlayer();
      expect(game.currentPlayerIndex).toEqual(2);
      game.nextPlayer();
      expect(game.currentPlayerIndex).toEqual(3);
      game.nextPlayer();
      expect(game.currentPlayerIndex).toEqual(0);
    });
  });

  describe('currentPlayerRollDice()', () => {
    it('should let the current player roll the dice', () => {
      spyOn(game.players[0], 'rollDice');
      game.currentPlayerRollDice();
      expect(
        game.players[0].rollDice
      ).toHaveBeenCalledWith(game.dice);
    });
  });

  describe('determineFirstPlayer()', () => {
    it('should determine the first player', () => {
      const diceRollValues = [1, 2, 4, 4, 5, 6, 2, 3];
      spyOn(game.dice, 'roll').and.returnValues(...diceRollValues);
      expect(game.isFirstPlayerDetermined).toBeFalse();
      diceRollValues.forEach(() => {
        game.currentPlayerRollDice();
      });
      expect(game.isFirstPlayerDetermined).toBeTrue();
      expect(game.currentPlayerIndex).toEqual(1);
    });
  });
});
