/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Color } from './color';
import { FirstPlayerDeterminer } from './first-player-determiner';
import { Game } from './game';
import { Pawn } from './pawn';
import { Player } from './player';

describe('Game', () => {
  let firstPlayerDeterminerSpy: FirstPlayerDeterminer;
  let playersMock: Player[];

  let game: Game;

  beforeEach(() => {
    playersMock = [new Player(), new Player(), new Player(), new Player()];
    playersMock.forEach((player) => {
      spyOn(player, 'putPawnsOnHomeFields');
      spyOn(player, 'movePawnToStartField');
      spyOn(player, 'movePawnFromStartField');
    });

    firstPlayerDeterminerSpy = new FirstPlayerDeterminer();
    game = new Game(playersMock, firstPlayerDeterminerSpy);
  });

  describe('constructor()', () => {
    it('should create 4 players with 4 pawns each', () => {
      expect(game.players.length).toBe(4);

      expect(game.players[0].pawns.length).toBe(4);
      expect(
        game.players[0].pawns.every((pawn: Pawn) => pawn.color === Color.Blue)
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
        expect(player.putPawnsOnHomeFields).toHaveBeenCalled();
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
      spyOnProperty(game.currentPlayer, 'latestDiceRoll').and.returnValues(
        4,
        6
      );

      game.currentPlayerRollDice();
      game.currentPlayerRollDice();

      expect(game.players[0].movePawnToStartField).toHaveBeenCalled();
      expect(game.players[1].movePawnToStartField).not.toHaveBeenCalled();
      expect(game.players[2].movePawnToStartField).not.toHaveBeenCalled();
      expect(game.players[3].movePawnToStartField).not.toHaveBeenCalled();
      expect(game.currentPlayerIndex).toBe(0);
    });

    it('should let player move pawn from start field', () => {
      spyOn(
        firstPlayerDeterminerSpy,
        'isFirstPlayerAlreadyDetermined'
      ).and.returnValue(true);
      spyOnProperty(
        firstPlayerDeterminerSpy,
        'firstPlayerIndex'
      ).and.returnValue(0);
      spyOnProperty(game.currentPlayer, 'latestDiceRoll').and.returnValues(
        4,
        6,
        6
      );

      // determine first player
      game.currentPlayerRollDice();
      // move pawn to start field
      game.currentPlayerRollDice();
      // move pawn from start field
      game.currentPlayerRollDice();
      expect(game.players[0].movePawnFromStartField).toHaveBeenCalled();
      expect(game.players[1].movePawnFromStartField).not.toHaveBeenCalled();
      expect(game.players[2].movePawnFromStartField).not.toHaveBeenCalled();
      expect(game.players[3].movePawnFromStartField).not.toHaveBeenCalled();
      expect(game.currentPlayerIndex).toBe(1);
    });

    it('should give the turn to the next player when no pawns are able to move', () => {
      spyOn(
        firstPlayerDeterminerSpy,
        'isFirstPlayerAlreadyDetermined'
      ).and.returnValue(true);
      spyOnProperty(
        firstPlayerDeterminerSpy,
        'firstPlayerIndex'
      ).and.returnValue(0);
      spyOnProperty(game.currentPlayer, 'latestDiceRoll').and.returnValues(
        4,
        4,
      );
      spyOn(game.currentPlayer, 'hasPawnsToMove').and.returnValue(false);

      // determine first player
      game.currentPlayerRollDice();
      // no pawns on normal field or start field
      game.currentPlayerRollDice();

      expect(game.currentPlayerIndex).toBe(1);
    });
  });
});
