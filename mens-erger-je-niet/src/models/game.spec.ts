import { GameEvent } from 'app/game-event-message';
import { BehaviorSubject, Observer } from 'rxjs';
import { Board } from './board';
import { Color } from './color';
import { Dice } from './dice';
import { DiceRollAction } from './dice-roll-action';
import { DiceRollActionDeterminer } from './dice-roll-action-determiner';
import { FieldGroup } from './field-group';
import { HomeField } from './fields/home-field';
import { FirstPlayerDeterminer } from './first-player-determiner';
import { Game } from './game';
import { Pawn } from './pawn';
import { Player } from './player';
import { Turn } from './turn';

type DiceSpy = { dice: Dice; rollSpy: jasmine.Spy<() => number> };
function createDiceSpy(): DiceSpy {
  const dice = new Dice();
  return { dice, rollSpy: spyOn(dice, 'roll') };
}

type BoardSpy = {
  board: Board;
  getFieldGroupByColorSpy: jasmine.Spy<(color: Color) => FieldGroup>;
};
function createBoardSpy(): BoardSpy {
  const board = new Board();
  const boardSpy = {
    board,
    getFieldGroupByColorSpy: spyOn(board, 'getFieldGroupByColor'),
  };
  boardSpy.getFieldGroupByColorSpy.and.callThrough();
  return boardSpy;
}

type FirstPlayerDeterminerSpy = {
  firstPlayerDeterminer: jasmine.SpyObj<FirstPlayerDeterminer>;
  firstPlayerIndex$Spy: BehaviorSubject<number>;
};

function createFirstPlayerDeterminerSpy(): FirstPlayerDeterminerSpy {
  const firstPlayerIndex$Spy = new BehaviorSubject<number>(-1);

  return {
    firstPlayerDeterminer: jasmine.createSpyObj('FirstPlayerDeterminer', [], {
      firstPlayerIndex$: firstPlayerIndex$Spy,
    }),
    firstPlayerIndex$Spy: firstPlayerIndex$Spy,
  };
}

type PlayerSpy = {
  player: Player;
  turn$Spy: BehaviorSubject<Turn | undefined>;
  putPawnsOnHomeFieldsSpy: jasmine.Spy<
    (homeFields: readonly HomeField[]) => void
  >;
  rollDiceSpy: jasmine.Spy<(dice: Dice) => void>;
  findPawnOnHomeFieldSpy: jasmine.Spy<() => Pawn | undefined>;
  movePawnToStartFieldSpy: jasmine.Spy<() => void>;
  //   putPawnsOnHomeFieldsSpy: jasmine.Spy<(homeFields: HomeField[]) => void>;
  //   movePawnFromStartFieldSpy: jasmine.Spy<() => void>;
  //   movePawnSpy: jasmine.Spy<(pawn: Pawn) => Pawn | undefined>;
  //   latestDiceRollSpy: jasmine.Spy<(this: Player) => number>;
  //   hasPawnsToMoveSpy: jasmine.Spy<() => boolean>;
  //   findPawnOnHomeField: jasmine.Spy<() => Pawn | undefined>;
};

function createPlayerSpy(): PlayerSpy {
  const player = new Player();
  const turn$Spy = new BehaviorSubject<Turn | undefined>(undefined);

  const playerSpy = {
    player,
    turn$Spy,
    putPawnsOnHomeFieldsSpy: spyOn(player, 'putPawnsOnHomeFields'),
    rollDiceSpy: spyOn(player, 'rollDice'),
    findPawnOnHomeFieldSpy: spyOn(player, 'findPawnOnHomeField'),
    movePawnToStartFieldSpy: spyOn(player, 'movePawnToStartField'),
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (player as any)['trurn$'] = turn$Spy;
  // spyOnProperty(player, 'turn$').and.returnValue(turn$Spy);
  return playerSpy;
}

type DiceRollActionDeterminerSpy = {
  diceRollActionDeterminer: DiceRollActionDeterminer;
  determineActionSpy: jasmine.Spy<(currentPlayer: Player) => DiceRollAction>;
};

function createDiceRollActionDeterminerSpy(): DiceRollActionDeterminerSpy {
  const diceRollActionDeterminer = new DiceRollActionDeterminer();

  return {
    diceRollActionDeterminer,
    determineActionSpy: spyOn(diceRollActionDeterminer, 'determineAction'),
  };
}

describe('Game', () => {
  //   const createPlayerSpy = (pawnColor: Color): PlayerSpy => {
  //     const player = new Player();
  //     const spy = {
  //       player,
  //       rollDiceSpy: spyOn(player, 'rollDice'),
  //       putPawnsOnHomeFieldsSpy: spyOn(player, 'putPawnsOnHomeFields'),
  //       movePawnToStartFieldSpy: spyOn(player, 'movePawnToStartField'),
  //       movePawnFromStartFieldSpy: spyOn(player, 'movePawnFromStartField'),
  //       movePawnSpy: spyOn(player, 'movePawn'),
  //       latestDiceRollSpy: spyOnProperty(player, 'turn$'),
  //       hasPawnsToMoveSpy: spyOn(player, 'hasPawnsToMove'),
  //       findPawnOnHomeField: spyOn(player, 'findPawnOnHomeField'),
  //     };

  //     spy.latestDiceRollSpy.and.returnValue(0);
  //     return spy;
  //   };

  //   let firstPlayerDeterminerSpy: FirstPlayerDeterminerSpy;
  //   let playerSpies: PlayerSpy[];

  //   let diceSpy: { dice: Dice; rollSpy: jasmine.Spy<() => number> };

  const arrangeDetermineFirstPlayer = (): void => {
    firstPlayerDeterminerSpy.firstPlayerIndex$Spy.next(1);
    // playerSpies[0].turn$Spy.next({
    //   diceRoll: 5,
    //   isPlayerPuttingPawnOnStartField: false,
    // });
  };

  const arrangeMovePawnToStartField = (): void => {
    arrangeDetermineFirstPlayer();
    diceRollActionDeterminerSpy.determineActionSpy.and.returnValue(
      DiceRollAction.MovePawnToStart
    );

    playerSpies[1].turn$Spy.next({
      diceRoll: 6,
      isPlayerPuttingPawnOnStartField: false,
    });

    playerSpies[1].findPawnOnHomeFieldSpy.and.returnValue(new Pawn(Color.Blue));
    game.currentPlayerRollDice();
  };

  //   const arrangeMovePawnFromStartField = (): void => {
  //     arrangeMovePawnToStartField();
  //     game.currentPlayerRollDice();
  //   };

  //   const arrangeMovePawn = (latestDiceRoll: number): void => {
  //     arrangeMovePawnFromStartField();
  //     playerSpies[1].findPawnOnHomeField.and.returnValue(undefined);

  //     // player 2 roll dice
  //     game.currentPlayerRollDice();
  //     expect(playerSpies[2].rollDiceSpy).toHaveBeenCalledWith(diceSpy.dice);
  //     expect(game.currentPlayerIndex).toBe(3);

  //     // player 3 roll dice
  //     game.currentPlayerRollDice();
  //     expect(playerSpies[3].rollDiceSpy).toHaveBeenCalledWith(diceSpy.dice);
  //     expect(game.currentPlayerIndex).toBe(0);

  //     // player 0 roll dice
  //     game.currentPlayerRollDice();
  //     expect(playerSpies[0].rollDiceSpy).toHaveBeenCalledWith(diceSpy.dice);
  //     expect(game.currentPlayerIndex).toBe(1);

  //     // player 1 roll dice
  //     gameEventObserver.next.calls.reset();
  //     playerSpies[1].latestDiceRollSpy.and.returnValue(latestDiceRoll);
  //     playerSpies[1].hasPawnsToMoveSpy.and.returnValue(true);
  //     game.currentPlayerRollDice();

  //     // back at first player, who has a pawn to move
  //     game.currentPlayerMovePawn(playerSpies[1].player.pawns[0]);
  //   };

  let diceSpy: DiceSpy;
  let boardSpy: BoardSpy;
  let firstPlayerDeterminerSpy: FirstPlayerDeterminerSpy;
  let diceRollActionDeterminerSpy: DiceRollActionDeterminerSpy;
  let playerSpies: PlayerSpy[];

  let game: Game;

  beforeEach(() => {
    playerSpies = [
      createPlayerSpy(),
      createPlayerSpy(),
      createPlayerSpy(),
      createPlayerSpy(),
    ];

    diceSpy = createDiceSpy();
    boardSpy = createBoardSpy();
    firstPlayerDeterminerSpy = createFirstPlayerDeterminerSpy();
    diceRollActionDeterminerSpy = createDiceRollActionDeterminerSpy();

    game = new Game(
      diceSpy.dice,
      boardSpy.board,
      playerSpies.map((playerSpy) => playerSpy.player),
      firstPlayerDeterminerSpy.firstPlayerDeterminer
    );
  });

  describe('constructor()', () => {
    it('should give 4 pawns to each player', () => {
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
      boardSpy.getFieldGroupByColorSpy.and.callThrough();

      expect(game.players[0].putPawnsOnHomeFields).toHaveBeenCalledWith(
        boardSpy.board.fieldGroups[0].homeFields
      );

      expect(game.players[1].putPawnsOnHomeFields).toHaveBeenCalledWith(
        boardSpy.board.fieldGroups[1].homeFields
      );

      expect(game.players[2].putPawnsOnHomeFields).toHaveBeenCalledWith(
        boardSpy.board.fieldGroups[2].homeFields
      );

      expect(game.players[3].putPawnsOnHomeFields).toHaveBeenCalledWith(
        boardSpy.board.fieldGroups[3].homeFields
      );
    });

    //     it('should raise GameNotStartedYet event', () => {
    //       gameEventObserver.next.calls.reset();
    //       game = new Game(
    //         diceSpy.dice,
    //         boardSpy.board,
    //         playerSpies.map((playerSpy) => playerSpy.player),
    //         firstPlayerDeterminerSpy.firsPlayerDeterminer
    //       );
    //       game.gameEvent$.subscribe(gameEventObserver);

    //       expect(gameEventObserver.next).toHaveBeenCalledWith({
    //         event: GameEvent.GameNotStartedYet,
    //         info: { currentPlayerIndex: 0, nextPlayerIndex: 1, latestDiceRoll: 0 },
    //       });
    //     });
  });

  describe('get currentPlayer()', () => {
    it('should return the player at the current player index', () => {
      expect(game.currentPlayer).toBe(game.players[0]);
    });
  });

  describe('currentPlayerRollDice()', () => {
    it('should give the turn to the next player when first player not yet determined', () => {
      game.currentPlayerRollDice();
      firstPlayerDeterminerSpy.firstPlayerIndex$Spy.next(-1);
      expect(playerSpies[0].rollDiceSpy).toHaveBeenCalledWith(diceSpy.dice);
      expect(game.currentPlayerIndex).toBe(1);
      // expect(gameEventObserver.next).toHaveBeenCalledWith({
      //   event: GameEvent.DetermineFirstPlayerFailed,
      //   info: {
      //     currentPlayerIndex: 0,
      //     latestDiceRoll: 3,
      //     nextPlayerIndex: 1,
      //   },
      // });
    });

    fit('should give the turn to player with highest dice roll when first player determined', () => {
      arrangeDetermineFirstPlayer();

      expect(game.currentPlayerIndex).toBe(1);
      // expect(gameEventObserver.next).toHaveBeenCalledWith({
      //   event: GameEvent.FirstPlayerDetermined,
      //   info: {
      //     currentPlayerIndex: 0,
      //     latestDiceRoll: 5,
      //     nextPlayerIndex: 1,
      //   },
      // });
    });

    it('should let player put a pawn on start field when dice roll is 6', () => {
      arrangeMovePawnToStartField();

      expect(
        diceRollActionDeterminerSpy.determineActionSpy
      ).toHaveBeenCalledWith(playerSpies[1].player);
      expect(playerSpies[1].movePawnToStartFieldSpy).toHaveBeenCalled();
      expect(game.currentPlayerIndex).toBe(1);

      //       expect(gameEventObserver.next.calls.count()).toBe(2);
      //       const params = gameEventObserver.next.calls.mostRecent().args[0];
      //       expect(params.event).toBe(GameEvent.CurrentPlayerMovedPawnToStartField);
      //       expect(params.info).toEqual({
      //         currentPlayerIndex: 1,
      //         latestDiceRoll: 6,
      //         nextPlayerIndex: 2,
      //       });
    });

    //     it('should let player move pawn from start field', () => {
    //       arrangeMovePawnFromStartField();

    //       expect(playerSpies[1].movePawnFromStartFieldSpy).toHaveBeenCalled();
    //       expect(game.currentPlayerIndex).toBe(2);

    //       const params = gameEventObserver.next.calls.mostRecent().args[0];
    //       expect(params.event).toBe(GameEvent.CurrentPlayerMovedPawnFromStartField);
    //       expect(params.info).toEqual({
    //         currentPlayerIndex: 1,
    //         latestDiceRoll: 6,
    //         nextPlayerIndex: 2,
    //       });
    //     });

    //     it('should let the current player move a pawn', () => {
    //       playerSpies[1].findPawnOnHomeField.and.returnValue(new Pawn(Color.Blue));
    //       arrangeMovePawn(5);

    //       expect(game.currentPlayerIndex).toBe(2);
    //       expect(playerSpies[1].movePawnSpy).toHaveBeenCalledWith(
    //         game.players[1].pawns[0]
    //       );

    //       expect(gameEventObserver.next).toHaveBeenCalledWith({
    //         event: GameEvent.CurrentPlayerMovedPawn,
    //         info: {
    //           currentPlayerIndex: 1,
    //           latestDiceRoll: 5,
    //           nextPlayerIndex: 2,
    //         },
    //       });
    //     });

    //     it('should let the current player move a pawn when dice roll is 6 and no pawns on home field', () => {
    //       playerSpies[1].findPawnOnHomeField.and.returnValue(undefined);
    //       arrangeMovePawn(6);

    //       expect(game.currentPlayerIndex).toBe(2);
    //       expect(playerSpies[1].movePawnSpy).toHaveBeenCalledWith(
    //         game.players[1].pawns[0]
    //       );

    //       expect(gameEventObserver.next).toHaveBeenCalledWith({
    //         event: GameEvent.CurrentPlayerMovedPawn,
    //         info: {
    //           currentPlayerIndex: 1,
    //           latestDiceRoll: 6,
    //           nextPlayerIndex: 2,
    //         },
    //       });
    //     });
  });
});
