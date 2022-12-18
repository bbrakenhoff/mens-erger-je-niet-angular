import { TestScheduler } from 'rxjs/testing';
import { Board } from './board';
import { BoardGame } from './board-game';
import { Color } from './color';
import { Dice } from './dice';
import { Pawn } from './pawn';
import { Player } from './player';

type DiceSpy = {
  dice: Dice;
  roll: jasmine.Spy<() => number>;
};

function createDiceSpy(): DiceSpy {
  const dice = new Dice();
  return { dice, roll: spyOn(dice, 'roll') };
}

type PlayerSpy = {
  player: Player;
  putPawnsOnHomeFields: jasmine.Spy<() => void>;
  rollDice: jasmine.Spy<(dice: Dice) => void>;
};

function createPlayerSpy(): PlayerSpy {
  const player = new Player();
  return {
    player,
    putPawnsOnHomeFields: spyOn(player, 'putPawnsOnHomeFields'),
    rollDice: spyOn(player, 'rollDice'),
  };
}

describe('BoardGame', () => {
  const firstPlayerIndex = 1;

  let playerSpies: PlayerSpy[];
  let diceSpy: DiceSpy;
  let board: Board;

  let boardGame: BoardGame;

  let testScheduler: TestScheduler;

  beforeEach(() => {
    playerSpies = [
      createPlayerSpy(),
      createPlayerSpy(),
      createPlayerSpy(),
      createPlayerSpy(),
    ];
    diceSpy = createDiceSpy();
    board = new Board();

    boardGame = new BoardGame(
      firstPlayerIndex,
      playerSpies.map((playerSpy) => playerSpy.player),
      diceSpy.dice,
      board
    );

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('constructor', () => {
    it('should give 4 pawns to each player', () => {
      expect(boardGame.players.length).toBe(4);

      expect(boardGame.players[0].pawns.length).toBe(4);
      expect(
        boardGame.players[0].pawns.every(
          (pawn: Pawn) => pawn.color === Color.Blue
        )
      );
      expect(boardGame.players[1].pawns.length).toBe(4);
      expect(
        boardGame.players[1].pawns.every(
          (pawn: Pawn) => pawn.color === Color.Green
        )
      );
      expect(boardGame.players[2].pawns.length).toBe(4);
      expect(
        boardGame.players[2].pawns.every(
          (pawn: Pawn) => pawn.color === Color.Red
        )
      );
      expect(boardGame.players[3].pawns.length).toBe(4);
      expect(
        boardGame.players[3].pawns.every(
          (pawn: Pawn) => pawn.color === Color.Yellow
        )
      );
    });

    it('should let players put pawns on home fields', () => {
      expect(boardGame.players[0].putPawnsOnHomeFields).toHaveBeenCalledWith(
        board.fieldGroups[0].homeFields
      );

      expect(boardGame.players[1].putPawnsOnHomeFields).toHaveBeenCalledWith(
        board.fieldGroups[1].homeFields
      );

      expect(boardGame.players[2].putPawnsOnHomeFields).toHaveBeenCalledWith(
        board.fieldGroups[2].homeFields
      );

      expect(boardGame.players[3].putPawnsOnHomeFields).toHaveBeenCalledWith(
        board.fieldGroups[3].homeFields
      );
    });

    it('should give the first player the turn', () => {
      testScheduler.run(({ expectObservable }) => {
        expectObservable(boardGame.currentPlayerIndex$$).toBe('a', {
          a: firstPlayerIndex,
        });
        expectObservable(boardGame.currentPlayerTurn$).toBe('a', {
          a: {
            playerIndex: 1,
            turn: { diceRoll: -1, isPlayerPuttingPawnOnStartField: false },
          },
        });
      });
    });
  });

  describe('currentPlayerRollDice()', () => {
    it('should let the current player roll the dice', () => {
      boardGame.currentPlayerRollDice();
      expect(playerSpies[firstPlayerIndex].rollDice).toHaveBeenCalledWith(
        diceSpy.dice
      );
    });
  });
});
