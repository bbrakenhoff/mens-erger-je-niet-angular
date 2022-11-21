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
  hasPawnsToMove: jasmine.Spy<() => boolean>;
};

type FirstPlayerDeterminerSpy = {
  firsPlayerDeterminer: FirstPlayerDeterminer;
  determineFirstPlayerSpy: jasmine.Spy<
    (players: readonly Player[], currentPlayerIndex: number) => void
  >;
  isFirstPlayerAlreadyDeterminedSpy: jasmine.Spy<() => boolean>;
  firstPlayerIndexSpy: jasmine.Spy<(this: FirstPlayerDeterminer) => number>;
};

let currentPlayerObserverSy: {
  currentPlayerObserver: Observer<Player>;
  nextSpy: jasmine.Spy<(currentPlayer: Player) => void>;
};

describe('Game', () => {
  const createPlayerSpy = (): PlayerSpy => {
    const player = new Player();
    return {
      player,
      rollDiceSpy: spyOn(player, 'rollDice'),
      putPawnsOnHomeFieldsSpy: spyOn(player, 'putPawnsOnHomeFields'),
      movePawnToStartFieldSpy: spyOn(player, 'movePawnToStartField'),
      movePawnFromStartFieldSpy: spyOn(player, 'movePawnFromStartField'),
      movePawnSpy: spyOn(player, 'movePawn'),
      latestDiceRollSpy: spyOnProperty(player, 'latestDiceRoll'),
      hasPawnsToMove: spyOn(player, 'hasPawnsToMove'),
    };
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
  let playersSpies: PlayerSpy[];

  let diceSpy: { dice: Dice; rollSpy: jasmine.Spy<() => number> };
  let boardSpy: {
    board: Board;
    getFieldGroupByColorSpy: jasmine.Spy<(color: Color) => FieldGroup>;
  };

  const arrangeDetermineFirstPlayer = (): void => {
    firstPlayerDeterminerSpy.isFirstPlayerAlreadyDeterminedSpy.and.returnValue(
      true
    );
    firstPlayerDeterminerSpy.firstPlayerIndexSpy.and.returnValue(1);
    game.currentPlayerRollDice();
  };

  const arrangeMovePawnToStartField = (): void => {
    arrangeDetermineFirstPlayer();
    playersSpies[1].latestDiceRollSpy.and.returnValues(6);
    game.currentPlayerRollDice();
  };

  const arrangeMovePawnFromStartField = (): void => {
    arrangeMovePawnToStartField();
    game.currentPlayerRollDice();
  };

  let game: Game;

  beforeEach(() => {
    playersSpies = [
      createPlayerSpy(),
      createPlayerSpy(),
      createPlayerSpy(),
      createPlayerSpy(),
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

    const currentPlayerObserver = jasmine.createSpyObj(
      'currentPlayerObserver',
      ['next', 'error', 'complete']
    );
    currentPlayerObserverSy = {
      currentPlayerObserver,
      nextSpy: currentPlayerObserver.next,
    };

    game = new Game(
      dice,
      board,
      playersSpies.map((playerSpy) => playerSpy.player),
      firstPlayerDeterminerSpy.firsPlayerDeterminer
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
  });

  describe('get currentPlayer()', () => {
    it('should return the player at the current player index', () => {
      game.currentPlayerIndex = 1;
      expect(game.currentPlayer).toBe(game.players[1]);
    });
  });

  describe('currentPlayerRollDice()', () => {
    it('should give the turn to the next player when first player not yet determined', () => {
      game.currentPlayerRollDice();
      expect(playersSpies[0].rollDiceSpy).toHaveBeenCalledWith(diceSpy.dice);
      expect(game.currentPlayerIndex).toBe(1);
    });

    it('should give the turn to player with highest dice roll when first player determined', () => {
      arrangeDetermineFirstPlayer();
      expect(game.currentPlayerIndex).toBe(1);
    });

    it('should let player put a pawn on start field when dice roll is 6', () => {
      arrangeMovePawnToStartField();

      expect(playersSpies[1].movePawnToStartFieldSpy).toHaveBeenCalled();
      expect(game.currentPlayerIndex).toBe(1);
    });

    it('should let player move pawn from start field', () => {
      arrangeMovePawnFromStartField();

      expect(playersSpies[1].movePawnFromStartFieldSpy).toHaveBeenCalled();
      expect(game.currentPlayerIndex).toBe(2);
    });

    it('should let the current player move a pawn', () => {
      arrangeMovePawnFromStartField();

      // let other players have a turn
      game.currentPlayerRollDice();
      expect(playersSpies[2].rollDiceSpy).toHaveBeenCalledWith(diceSpy.dice);
      expect(game.currentPlayerIndex).toBe(3);

      game.currentPlayerRollDice();
      expect(playersSpies[3].rollDiceSpy).toHaveBeenCalledWith(diceSpy.dice);
      expect(game.currentPlayerIndex).toBe(0);

      // back at first player, who has a pawn to move
      game.currentPlayerRollDice();
      expect(playersSpies[0].rollDiceSpy).toHaveBeenCalledWith(diceSpy.dice);
      expect(game.currentPlayerIndex).toBe(1);

      // TODO: Bijoya - should have rolled the dice first
      game.currentPlayerMovePawn(game.currentPlayer.pawns[0]);

      expect(playersSpies[1].movePawnSpy).toHaveBeenCalledWith(
        game.players[1].pawns[0]
      );
    });
  });
});
