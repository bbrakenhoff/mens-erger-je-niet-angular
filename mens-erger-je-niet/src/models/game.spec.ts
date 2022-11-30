import { GameEvent, GameEventInfo } from 'app/game-event-message';
import { Observer } from 'rxjs';
import { Board } from './board';
import { Color } from './color';
import { Dice } from './dice';
import { FieldGroup } from './field-group';
import { HomeField } from './fields/home-field';
import { FirstPlayerDeterminer } from './first-player-determiner';
import { Game } from './game';
import { Pawn } from './pawn';
import { Player } from './player';

type PlayerSpy = {
  player: Player;
  rollDiceSpy: jasmine.Spy<(dice: Dice) => void>;
  putPawnsOnHomeFieldsSpy: jasmine.Spy<(homeFields: HomeField[]) => void>;
  movePawnToStartFieldSpy: jasmine.Spy<() => void>;
  movePawnFromStartFieldSpy: jasmine.Spy<() => void>;
  movePawnSpy: jasmine.Spy<(pawn: Pawn) => Pawn | undefined>;
  latestDiceRollSpy: jasmine.Spy<(this: Player) => number>;
  hasPawnsToMoveSpy: jasmine.Spy<() => boolean>;
  findPawnOnHomeField: jasmine.Spy<() => Pawn | undefined>;
};

type FirstPlayerDeterminerSpy = {
  firsPlayerDeterminer: FirstPlayerDeterminer;
  determineFirstPlayerSpy: jasmine.Spy<
    (players: readonly Player[], currentPlayerIndex: number) => void
  >;
  isFirstPlayerAlreadyDeterminedSpy: jasmine.Spy<() => boolean>;
  firstPlayerIndexSpy: jasmine.Spy<(this: FirstPlayerDeterminer) => number>;
};
let gameEventObserver: jasmine.SpyObj<
  Observer<{ event: GameEvent; info: GameEventInfo }>
>;

describe('Game', () => {
  const createPlayerSpy = (pawnColor: Color): PlayerSpy => {
    const player = new Player();
    const spy = {
      player,
      rollDiceSpy: spyOn(player, 'rollDice'),
      putPawnsOnHomeFieldsSpy: spyOn(player, 'putPawnsOnHomeFields'),
      movePawnToStartFieldSpy: spyOn(player, 'movePawnToStartField'),
      movePawnFromStartFieldSpy: spyOn(player, 'movePawnFromStartField'),
      movePawnSpy: spyOn(player, 'movePawn'),
      latestDiceRollSpy: spyOnProperty(player, 'latestDiceRoll'),
      hasPawnsToMoveSpy: spyOn(player, 'hasPawnsToMove'),
      findPawnOnHomeField: spyOn(player, 'findPawnOnHomeField'),
    };

    spy.latestDiceRollSpy.and.returnValue(0);
    return spy;
  };
  const createFirstPlayerDeterminerSpy = (): FirstPlayerDeterminerSpy => {
    const firstPlayerDeterminer = new FirstPlayerDeterminer();
    return {
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
  };

  let firstPlayerDeterminerSpy: FirstPlayerDeterminerSpy;
  let playerSpies: PlayerSpy[];

  let diceSpy: { dice: Dice; rollSpy: jasmine.Spy<() => number> };
  let boardSpy: {
    board: Board;
    getFieldGroupByColorSpy: jasmine.Spy<(color: Color) => FieldGroup>;
  };

  const arrangeDetermineFirstPlayer = (): void => {
    playerSpies[0].latestDiceRollSpy.and.returnValue(5);
    firstPlayerDeterminerSpy.isFirstPlayerAlreadyDeterminedSpy.and.returnValue(
      true
    );
    firstPlayerDeterminerSpy.firstPlayerIndexSpy.and.returnValue(1);
    game.currentPlayerRollDice();
  };

  const arrangeMovePawnToStartField = (): void => {
    arrangeDetermineFirstPlayer();
    playerSpies[1].latestDiceRollSpy.and.returnValue(6);
    playerSpies[1].findPawnOnHomeField.and.returnValue(new Pawn(Color.Blue));
    game.currentPlayerRollDice();
  };

  const arrangeMovePawnFromStartField = (): void => {
    arrangeMovePawnToStartField();
    game.currentPlayerRollDice();
  };

  const arrangeMovePawn = (latestDiceRoll: number): void => {
    arrangeMovePawnFromStartField();
    playerSpies[1].findPawnOnHomeField.and.returnValue(undefined);

    // player 2 roll dice
    game.currentPlayerRollDice();
    expect(playerSpies[2].rollDiceSpy).toHaveBeenCalledWith(diceSpy.dice);
    expect(game.currentPlayerIndex).toBe(3);

    // player 3 roll dice
    game.currentPlayerRollDice();
    expect(playerSpies[3].rollDiceSpy).toHaveBeenCalledWith(diceSpy.dice);
    expect(game.currentPlayerIndex).toBe(0);

    // player 0 roll dice
    game.currentPlayerRollDice();
    expect(playerSpies[0].rollDiceSpy).toHaveBeenCalledWith(diceSpy.dice);
    expect(game.currentPlayerIndex).toBe(1);

    // player 1 roll dice
    gameEventObserver.next.calls.reset();
    playerSpies[1].latestDiceRollSpy.and.returnValue(latestDiceRoll);
    playerSpies[1].hasPawnsToMoveSpy.and.returnValue(true);
    game.currentPlayerRollDice();

    // back at first player, who has a pawn to move
    game.currentPlayerMovePawn(playerSpies[1].player.pawns[0]);
  };

  let game: Game;

  beforeEach(() => {
    playerSpies = [
      createPlayerSpy(Color.Blue),
      createPlayerSpy(Color.Green),
      createPlayerSpy(Color.Red),
      createPlayerSpy(Color.Yellow),
    ];

    firstPlayerDeterminerSpy = createFirstPlayerDeterminerSpy();

    const dice = new Dice();
    diceSpy = { dice, rollSpy: spyOn(dice, 'roll') };

    const board = new Board();
    boardSpy = {
      board,
      getFieldGroupByColorSpy: spyOn(board, 'getFieldGroupByColor'),
    };
    boardSpy.getFieldGroupByColorSpy.and.callThrough();

    game = new Game(
      dice,
      board,
      playerSpies.map((playerSpy) => playerSpy.player),
      firstPlayerDeterminerSpy.firsPlayerDeterminer
    );

    gameEventObserver = jasmine.createSpyObj<
      Observer<{ event: GameEvent; info: GameEventInfo }>
    >('Observer', ['next', 'complete', 'error']);
    game.gameEvent$.subscribe(gameEventObserver);
    gameEventObserver.next.calls.reset();
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

    it('should raise GameNotStartedYet event', () => {
      gameEventObserver.next.calls.reset();
      game = new Game(
        diceSpy.dice,
        boardSpy.board,
        playerSpies.map((playerSpy) => playerSpy.player),
        firstPlayerDeterminerSpy.firsPlayerDeterminer
      );
      game.gameEvent$.subscribe(gameEventObserver);

      expect(gameEventObserver.next).toHaveBeenCalledWith({
        event: GameEvent.GameNotStartedYet,
        info: { currentPlayerIndex: 0, nextPlayerIndex: 1, latestDiceRoll: 0 },
      });
    });
  });

  describe('get currentPlayer()', () => {
    it('should return the player at the current player index', () => {
      expect(game.currentPlayer).toBe(game.players[0]);
    });
  });

  describe('currentPlayerRollDice()', () => {
    it('should give the turn to the next player when first player not yet determined', () => {
      playerSpies[0].latestDiceRollSpy.and.returnValue(3);
      game.currentPlayerRollDice();
      expect(playerSpies[0].rollDiceSpy).toHaveBeenCalledWith(diceSpy.dice);
      expect(game.currentPlayerIndex).toBe(1);
      expect(gameEventObserver.next).toHaveBeenCalledWith({
        event: GameEvent.DetermineFirstPlayerFailed,
        info: {
          currentPlayerIndex: 0,
          latestDiceRoll: 3,
          nextPlayerIndex: 1,
        },
      });
    });

    it('should give the turn to player with highest dice roll when first player determined', () => {
      arrangeDetermineFirstPlayer();

      expect(game.currentPlayerIndex).toBe(1);
      expect(gameEventObserver.next).toHaveBeenCalledWith({
        event: GameEvent.FirstPlayerDetermined,
        info: {
          currentPlayerIndex: 0,
          latestDiceRoll: 5,
          nextPlayerIndex: 1,
        },
      });
    });

    it('should let player put a pawn on start field when dice roll is 6', () => {
      arrangeMovePawnToStartField();

      expect(playerSpies[1].movePawnToStartFieldSpy).toHaveBeenCalled();
      expect(game.currentPlayerIndex).toBe(1);

      expect(gameEventObserver.next.calls.count()).toBe(2);
      const params = gameEventObserver.next.calls.mostRecent().args[0];
      expect(params.event).toBe(GameEvent.CurrentPlayerMovedPawnToStartField);
      expect(params.info).toEqual({
        currentPlayerIndex: 1,
        latestDiceRoll: 6,
        nextPlayerIndex: 2,
      });
    });

    it('should let player move pawn from start field', () => {
      arrangeMovePawnFromStartField();

      expect(playerSpies[1].movePawnFromStartFieldSpy).toHaveBeenCalled();
      expect(game.currentPlayerIndex).toBe(2);

      const params = gameEventObserver.next.calls.mostRecent().args[0];
      expect(params.event).toBe(GameEvent.CurrentPlayerMovedPawnFromStartField);
      expect(params.info).toEqual({
        currentPlayerIndex: 1,
        latestDiceRoll: 6,
        nextPlayerIndex: 2,
      });
    });

    it('should let the current player move a pawn', () => {
      playerSpies[1].findPawnOnHomeField.and.returnValue(new Pawn(Color.Blue));
      arrangeMovePawn(5);

      expect(game.currentPlayerIndex).toBe(2);
      expect(playerSpies[1].movePawnSpy).toHaveBeenCalledWith(
        game.players[1].pawns[0]
      );

      expect(gameEventObserver.next).toHaveBeenCalledWith({
        event: GameEvent.CurrentPlayerMovedPawn,
        info: {
          currentPlayerIndex: 1,
          latestDiceRoll: 5,
          nextPlayerIndex: 2,
        },
      });
    });

    it('should let the current player move a pawn when dice roll is 6 and no pawns on home field', () => {
      playerSpies[1].findPawnOnHomeField.and.returnValue(undefined);
      arrangeMovePawn(6);

      expect(game.currentPlayerIndex).toBe(2);
      expect(playerSpies[1].movePawnSpy).toHaveBeenCalledWith(
        game.players[1].pawns[0]
      );

      expect(gameEventObserver.next).toHaveBeenCalledWith({
        event: GameEvent.CurrentPlayerMovedPawn,
        info: {
          currentPlayerIndex: 1,
          latestDiceRoll: 6,
          nextPlayerIndex: 2,
        },
      });
    });
  });
});
