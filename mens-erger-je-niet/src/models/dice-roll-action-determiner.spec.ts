import { Color } from './color';
import { DiceRollAction } from './dice-roll-action';
import { DiceRollActionDeterminer } from './dice-roll-action-determiner';
import { Pawn } from './pawn';
import { Player } from './player';

describe('DiceRollActionDeterminer', () => {
  let playerSpy: {
    player: Player;
    // movePawnToStartFieldSpy: jasmine.Spy<() => void>;
    // movePawnFromStartFieldSpy: jasmine.Spy<() => void>;
    diceRollSpy: jasmine.Spy<(this: Player) => number>;
    isPlayerPuttingPawnOnStartFieldSpy: jasmine.Spy<(this: Player) => boolean>;
    hasPawnsToMoveSpy: jasmine.Spy<() => boolean>;
    findPawnOnHomeFieldSpy: jasmine.Spy<() => Pawn>;
  };

  let diceRollActionDeterminer: DiceRollActionDeterminer;

  beforeEach(() => {
    const player = new Player();
    playerSpy = {
      player,
      // movePawnToStartFieldSpy: spyOn(player, 'movePawnToStartField'),
      // movePawnFromStartFieldSpy: spyOn(player, 'movePawnFromStartField'),
      diceRollSpy: spyOnProperty(player, 'latestDiceRoll'),
      isPlayerPuttingPawnOnStartFieldSpy: spyOnProperty(
        player,
        'isPlayerPuttingPawnOnStartField'
      ),
      hasPawnsToMoveSpy: spyOn(player, 'hasPawnsToMove'),
      findPawnOnHomeFieldSpy: spyOn(player, 'findPawnOnHomeField'),
    };

    diceRollActionDeterminer = new DiceRollActionDeterminer(playerSpy.player);
  });

  describe('determineAction()', () => {
    it('should let player put a pawn on start field when players on home field and rolled 6', () => {
      playerSpy.diceRollSpy.and.returnValue(6);
      playerSpy.findPawnOnHomeFieldSpy.and.returnValue(new Pawn(Color.Blue));
      expect(diceRollActionDeterminer.determineAction()).toBe(
        DiceRollAction.MovePawnToStart
      );
    });

    it('should let player move pawn from start field', () => {
      playerSpy.isPlayerPuttingPawnOnStartFieldSpy.and.returnValue(true);
      expect(diceRollActionDeterminer.determineAction()).toBe(
        DiceRollAction.MovePawnFromStart
      );
    });

    it('should let the player move a pawn when player has movable pawns', () => {
      playerSpy.hasPawnsToMoveSpy.and.returnValue(true);
      expect(diceRollActionDeterminer.determineAction()).toBe(
        DiceRollAction.MovePawn
      );
    });

    it('should do nothing when no pawns on home fields and no pawns to move', () => {
      expect(diceRollActionDeterminer.determineAction()).toBe(
        DiceRollAction.DoNothing
      );
    });
  });
});
