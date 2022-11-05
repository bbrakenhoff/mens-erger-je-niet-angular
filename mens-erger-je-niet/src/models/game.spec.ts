import { Color } from './color';
import { HomeField } from './fields/home-field';
import { FirstPlayerDeterminer } from './first-player-determiner';
import { Game } from './game';
import { Pawn } from './pawn';

describe('Game', () => {
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

    it('should let players put pawns on home fields', () => {
      game.players.forEach((player) => {
        player.pawns.forEach((pawn, i) => {
          const homeField: HomeField = game.board.homeFields.get(pawn.color)?.[
            i
          ] as HomeField;
          expect(pawn.field).toBeDefined();
          expect(pawn.field).toBe(homeField);
          expect(homeField?.pawn).toBe(pawn);
          expect(homeField?.pawn).toBeDefined();
        });
      });
    });
  });

  describe('get currentPlayer()', () => {
    it('should return the player at the current player index', () => {
      game.currentPlayerIndex = 1;
      expect(game.currentPlayer).toBe(game.players[1]);
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

    it('should give the turn to player with highest dice roll when first player determined', () => {
      spyOn(
        firstPlayerDeterminerSpy,
        'isFirstPlayerAlreadyDetermined'
      ).and.returnValue(true);
      spyOnProperty(
        firstPlayerDeterminerSpy,
        'firstPlayerIndex'
      ).and.returnValue(1);
      game.currentPlayerRollDice();
      expect(game.currentPlayerIndex).toBe(1);
    });

    it('should let player put a pawn on start field when dice roll is 6', () => {
      spyOn(
        firstPlayerDeterminerSpy,
        'isFirstPlayerAlreadyDetermined'
      ).and.returnValue(true);
      spyOnProperty(
        firstPlayerDeterminerSpy,
        'firstPlayerIndex'
      ).and.returnValue(0);
      spyOnProperty(game.currentPlayer, 'latestDiceRoll').and.returnValue(6);
      spyOn(game.currentPlayer.pawns[0], 'moveToNextField');

      game.currentPlayerRollDice();
      game.currentPlayerRollDice();

      expect(game.players[0].pawns[0].moveToNextField).toHaveBeenCalled();
    });

    it('should not let player put a pawn on start field when dice roll is not 6', () => {
      spyOn(
        firstPlayerDeterminerSpy,
        'isFirstPlayerAlreadyDetermined'
      ).and.returnValue(true);
      spyOnProperty(
        firstPlayerDeterminerSpy,
        'firstPlayerIndex'
      ).and.returnValue(0);
      spyOnProperty(game.currentPlayer, 'latestDiceRoll').and.returnValue(5);
      spyOn(game.currentPlayer.pawns[0], 'moveToNextField');

      game.currentPlayerRollDice();

      expect(game.players[0].pawns[0].moveToNextField).not.toHaveBeenCalled();
      expect(game.currentPlayerIndex).toBe(0);
    });
  });
});
