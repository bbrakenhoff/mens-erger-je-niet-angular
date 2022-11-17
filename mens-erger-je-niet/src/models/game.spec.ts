import { Color } from './color';
import { FieldGroup } from './field-group';
import { HomeField } from './fields/home-field';
import { FirstPlayerDeterminer } from './first-player-determiner';
import { Game } from './game';
import { Pawn } from './pawn';
import { Player } from './player';

type PlayerSpy = {
  player: Player;
  putPawnsOnHomeFieldsSpy: jasmine.Spy<(homeFields: HomeField[]) => void>;
  movePawnToStartFieldSpy: jasmine.Spy<() => void>;
  movePawnFromStartFieldSpy: jasmine.Spy<() => void>;
  movePawnSpy: jasmine.Spy<(pawn: Pawn) => Pawn | undefined>;
  latestDiceRollSpy: jasmine.Spy<(this: Player) => number>;
  hasPawnsToMove: jasmine.Spy<() => boolean>;
};

describe('Game', () => {
  const createPlayerSpy = (): PlayerSpy => {
    const player = new Player();
    return {
      player,
      putPawnsOnHomeFieldsSpy: spyOn(player, 'putPawnsOnHomeFields'),
      movePawnToStartFieldSpy: spyOn(player, 'movePawnToStartField'),
      movePawnFromStartFieldSpy: spyOn(player, 'movePawnFromStartField'),
      movePawnSpy: spyOn(player, 'movePawn'),
      latestDiceRollSpy: spyOnProperty(player, 'latestDiceRoll'),
      hasPawnsToMove: spyOn(player, 'hasPawnsToMove'),
    };
  };

  let firstPlayerDeterminerSpy: {
    firsPlayerDeterminer: FirstPlayerDeterminer;
    determineFirstPlayerSpy: jasmine.Spy<
      (players: Player[], currentPlayerIndex: number) => void
    >;
    isFirstPlayerAlreadyDeterminedSpy: jasmine.Spy<() => boolean>;
    firstPlayerIndexSpy: jasmine.Spy<(this: FirstPlayerDeterminer) => number>;
  };
  let playersSpies: PlayerSpy[];
  let boardSpy: jasmine.Spy<(color: Color) => FieldGroup>;

  let game: Game;

  beforeEach(() => {
    playersSpies = [
      createPlayerSpy(),
      createPlayerSpy(),
      createPlayerSpy(),
      createPlayerSpy(),
    ];

    const firstPlayerDeterminer = new FirstPlayerDeterminer();
    firstPlayerDeterminerSpy = {
      firsPlayerDeterminer: firstPlayerDeterminer,
      determineFirstPlayerSpy: spyOn(
        firstPlayerDeterminer,
        'determineFirstPlayer'
      ),
      isFirstPlayerAlreadyDeterminedSpy: spyOn(
        firstPlayerDeterminer,
        'isFirstPlayerAlreadyDetermined'
      ),
      firstPlayerIndexSpy: spyOnProperty(
        firstPlayerDeterminer,
        'firstPlayerIndex'
      ),
    };

    new FirstPlayerDeterminer();
    game = new Game(
      playersSpies.map((playerSpy) => playerSpy.player),
      firstPlayerDeterminerSpy.firsPlayerDeterminer
    );

    boardSpy = spyOn(game.board, 'getFieldGroupByColor');
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
      boardSpy.and.callThrough();

      expect(game.players[0].putPawnsOnHomeFields).toHaveBeenCalledWith(
        game.board.fieldGroups[0].homeFields
      );

      expect(game.players[1].putPawnsOnHomeFields).toHaveBeenCalledWith(
        game.board.fieldGroups[1].homeFields
      );

      expect(game.players[2].putPawnsOnHomeFields).toHaveBeenCalledWith(
        game.board.fieldGroups[2].homeFields
      );

      expect(game.players[3].putPawnsOnHomeFields).toHaveBeenCalledWith(
        game.board.fieldGroups[3].homeFields
      );
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
      game.currentPlayerRollDice();
      expect(
        firstPlayerDeterminerSpy.determineFirstPlayerSpy
      ).toHaveBeenCalledWith(game.players, 0);
    });

    it('should give the turn to the next player when first player not yet determined', () => {
      game.currentPlayerRollDice();
      expect(game.currentPlayerIndex).toBe(1);
    });

    it('should give the turn to player with highest dice roll when first player determined', () => {
      firstPlayerDeterminerSpy.isFirstPlayerAlreadyDeterminedSpy.and.returnValue(
        true
      );
      firstPlayerDeterminerSpy.firstPlayerIndexSpy.and.returnValue(1);
      game.currentPlayerRollDice();
      expect(game.currentPlayerIndex).toBe(1);
    });

    it('should let player put a pawn on start field when dice roll is 6', () => {
      firstPlayerDeterminerSpy.isFirstPlayerAlreadyDeterminedSpy.and.returnValue(
        true
      );
      firstPlayerDeterminerSpy.firstPlayerIndexSpy.and.returnValue(0);
      playersSpies[0].latestDiceRollSpy.and.returnValues(6);

      game.currentPlayerRollDice();
      game.currentPlayerRollDice();

      expect(game.players[0].movePawnToStartField).toHaveBeenCalled();
      expect(game.currentPlayerIndex).toBe(0);
    });

    it('should let player move pawn from start field', () => {
      firstPlayerDeterminerSpy.isFirstPlayerAlreadyDeterminedSpy.and.returnValue(
        true
      );
      firstPlayerDeterminerSpy.firstPlayerIndexSpy.and.returnValue(0);
      playersSpies[0].latestDiceRollSpy.and.returnValues(6);

      expect(game.currentPlayerIndex).toBe(0);

      // determine first player
      game.currentPlayerRollDice();
      // move pawn to start field
      game.currentPlayerRollDice();
      // move pawn from start field
      game.currentPlayerRollDice();
      expect(game.players[0].movePawnFromStartField).toHaveBeenCalled();
      expect(game.currentPlayerIndex).toBe(1);
    });

    it('should let the current player move a pawn', () => {
      firstPlayerDeterminerSpy.isFirstPlayerAlreadyDeterminedSpy.and.returnValue(
        true
      );
      firstPlayerDeterminerSpy.firstPlayerIndexSpy.and.returnValue(0);
      playersSpies[0].latestDiceRollSpy.and.returnValues(4, 6, 6, 3);
      // spyOnProperty(game.currentPlayer, 'latestDiceRoll').and.returnValues(
      //   4,
      //   6,
      //   6,
      //   3
      // );
      playersSpies[0].hasPawnsToMove.and.returnValue(true);
      playersSpies[0].movePawnSpy.and.returnValue(undefined);

      // determine first player
      game.currentPlayerRollDice();
      // move pawn to start field
      game.currentPlayerRollDice();
      // move pawn from start field
      game.currentPlayerRollDice();

      // let other players have a turn
      game.currentPlayerRollDice();
      game.currentPlayerRollDice();
      game.currentPlayerRollDice();

      // back at first player
      game.currentPlayerRollDice();

      expect(game.currentPlayerIndex).toBe(0);
      game.currentPlayerRollDice();

      game.currentPlayerMovePawn(game.currentPlayer.pawns[0]);

      expect(game.players[0].movePawn).toHaveBeenCalledWith(
        game.players[0].pawns[0]
      );
    });
  });
});
