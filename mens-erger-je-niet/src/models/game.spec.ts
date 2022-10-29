import { allColors, Color } from './color';
import { FirstPlayerDeterminer } from './first-player-determiner';
import { Game } from './game';
import { Pawn } from './pawn';

fdescribe('Game', () => {
  let firstPlayerDeterminerSpy: FirstPlayerDeterminer;

  let game: Game;

  beforeEach(() => {
    firstPlayerDeterminerSpy = new FirstPlayerDeterminer();
    game = new Game(firstPlayerDeterminerSpy);
  });

  describe('constructor()', () => {
    it('should create 4 players with 4 pawns each', () => {
      expect(game.players.length).toBe(4);

      expect(game.players[0].pawns.length).toBe(4);
      expect(
        game.players[0].pawns.every((pawn: Pawn) => pawn.color === Color.Black)
      );
      expect(game.players[1].pawns.length).toBe(4);
      expect(
        game.players[1].pawns.every((pawn: Pawn) => pawn.color === Color.Green)
      );
      expect(game.players[2].pawns.length).toBe(4);
      expect(
        game.players[2].pawns.every((pawn: Pawn) => pawn.color === Color.Red)
      );
      expect(game.players[3].pawns.length).toBe(4);
      expect(
        game.players[3].pawns.every((pawn: Pawn) => pawn.color === Color.Yellow)
      );
    });
  });

  describe('nextPlayer()', () => {
    it('should update current player index', () => {
      expect(game.currentPlayerIndex).toBe(0);
      game.nextPlayer();
      expect(game.currentPlayerIndex).toBe(1);
      game.nextPlayer();
      expect(game.currentPlayerIndex).toBe(2);
      game.nextPlayer();
      expect(game.currentPlayerIndex).toBe(3);
      game.nextPlayer();
      expect(game.currentPlayerIndex).toBe(0);
    });
  });

  describe('currentPlayerRollDice()', () => {
    it('should let the current player roll the dice', () => {
      spyOn(game.players[0], 'rollDice');
      game.currentPlayerRollDice();
      expect(game.players[0].rollDice).toHaveBeenCalledWith(game.dice);
    });

    it('should determine the first player', () => {
      spyOn(firstPlayerDeterminerSpy, 'determineFirstPlayer');
      game.currentPlayerRollDice();
      expect(
        firstPlayerDeterminerSpy.determineFirstPlayer
      ).toHaveBeenCalledWith(game.players, 0);
    });

    it('should give the turn to the next player when first player not yet determined', () => {
      game.currentPlayerRollDice();
      expect(game.currentPlayerIndex).toBe(1);
    });

    it('should not give the turn to the next player when first player is already determined', () => {
      spyOn(
        firstPlayerDeterminerSpy,
        'isFirstPlayerAlreadyDetermined'
      ).and.returnValue(true);
      game.currentPlayerRollDice();
      expect(game.currentPlayerIndex).toBe(0);
    });
  });
});
