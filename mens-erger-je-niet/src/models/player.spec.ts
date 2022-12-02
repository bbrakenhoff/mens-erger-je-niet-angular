import { Color } from './color';
import { Dice } from './dice';
import { Field } from './fields/field';
import { HomeField } from './fields/home-field';
import { LandingField } from './fields/landing-field';
import { NormalField } from './fields/normal-field';
import { StartField } from './fields/start-field';
import { Pawn } from './pawn';
import { Player } from './player';

type PawnSpy = {
  pawn: Pawn;
  moveToSpy: jasmine.Spy<(newField: Field) => Pawn | undefined>;
  moveToFieldAfterSpy: jasmine.Spy<(steps: number) => Pawn | undefined>;
  moveToNextFieldSpy: jasmine.Spy<(newField: Field) => Pawn | undefined>;
};

describe('Player', () => {
  const createPawnSpy = (color: Color = Color.Blue): PawnSpy => {
    const pawn = new Pawn(color);
    return {
      pawn,
      moveToSpy: spyOn(pawn, 'moveTo'),
      moveToFieldAfterSpy: spyOn(pawn, 'moveToFieldAfter'),
      moveToNextFieldSpy: spyOn(pawn, 'moveToNextField'),
    };
  };

  const latestDiceRoll = 3;
  let pawnsSpies: PawnSpy[];
  let otherPlayersPawnSpy: PawnSpy;
  let player: Player;
  let dice: Dice;

  beforeEach(() => {
    dice = new Dice();
    spyOn(dice, 'roll').and.returnValue(latestDiceRoll);

    otherPlayersPawnSpy = createPawnSpy(Color.Red);

    pawnsSpies = [];
    for (let i = 0; i < 4; i++) {
      pawnsSpies.push(createPawnSpy());
    }

    player = new Player();
    player.pawns.push(...pawnsSpies.map((pawnSpy) => pawnSpy.pawn));
    player.startTurn();
  });

  describe('pawnColor', () => {
    it('should return the color of the pawns', () => {
      expect(player.pawnColor).toBe(pawnsSpies[0].pawn.color);
    });
  });

  describe('putPawnOnHomeField(pawn, homeFields)', () => {
    let homeFields: HomeField[];

    beforeEach(() => {
      homeFields = [
        new HomeField(Color.Blue),
        new HomeField(Color.Blue),
        new HomeField(Color.Blue),
        new HomeField(Color.Blue),
      ];
    });

    it('should put pawns on given home fields', () => {
      homeFields[0].pawn = pawnsSpies[1].pawn;
      homeFields[1].pawn = pawnsSpies[3].pawn;
      homeFields[2].pawn = pawnsSpies[0].pawn;

      player.putPawnOnHomeField(pawnsSpies[3].pawn, homeFields);
      expect(pawnsSpies[3].moveToSpy).toHaveBeenCalledWith(homeFields[3]);
    });

    it("should throw an error when trying to move another player's pawn", () => {
      const otherPawn = new Pawn(Color.Green);
      expect(() =>
        player.putPawnOnHomeField(otherPawn, homeFields)
      ).toThrowError("Player can only move it's own pawns");
    });
  });

  describe('putPawnsOnHomeFields(homeFields)', () => {
    it('should put pawns on given home fields', () => {
      const homeFields = [
        new HomeField(Color.Blue),
        new HomeField(Color.Blue),
        new HomeField(Color.Blue),
        new HomeField(Color.Blue),
      ];
      player.putPawnsOnHomeFields(homeFields);
      expect(pawnsSpies[0].moveToSpy).toHaveBeenCalledWith(homeFields[0]);
      expect(pawnsSpies[1].moveToSpy).toHaveBeenCalledWith(homeFields[1]);
      expect(pawnsSpies[2].moveToSpy).toHaveBeenCalledWith(homeFields[2]);
      expect(pawnsSpies[3].moveToSpy).toHaveBeenCalledWith(homeFields[3]);
    });
  });

  describe('rollDice(dice)', () => {
    it('should roll the dice and remember number of eyes rolled', () => {
      player.rollDice(dice);
      expect(player.latestDiceRoll).toBe(3);
      expect(dice.roll).toHaveBeenCalled();
    });

    it('should throw an error when player tries to roll the dice while not having a turn', () => {
      player.stopTurn();
      expect(() => player.rollDice(dice)).toThrowError(
        'Player must have an active turn in order to roll the dice'
      );
    });
  });

  describe('findPawnOnHomeField()', () => {
    it('should return first pawn found on home field', () => {
      const normalField0 = new NormalField(Color.Blue, 0);
      pawnsSpies[0].pawn.field = normalField0;
      const homeField0 = new HomeField(Color.Blue);
      pawnsSpies[1].pawn.field = homeField0;
      const homeField1 = new HomeField(Color.Blue);
      pawnsSpies[2].pawn.field = homeField1;
      const normalField3 = new NormalField(Color.Blue, 3);
      pawnsSpies[3].pawn.field = normalField3;

      expect(player.findPawnOnHomeField()).toBe(pawnsSpies[1].pawn);
    });

    it('should return undefined when no pawns on home field', () => {
      const normalField0 = new NormalField(Color.Blue, 0);
      pawnsSpies[0].pawn.field = normalField0;
      const normalField1 = new NormalField(Color.Blue, 1);
      pawnsSpies[1].pawn.field = normalField1;
      const normalField2 = new NormalField(Color.Blue, 2);
      pawnsSpies[2].pawn.field = normalField2;
      const normalField3 = new NormalField(Color.Blue, 3);
      pawnsSpies[3].pawn.field = normalField3;

      expect(player.findPawnOnHomeField()).toBeUndefined();
    });
  });

  describe('movePawnToStartField()', () => {
    it('should move the first pawn found on a home field to start field', () => {
      const normalField0 = new NormalField(Color.Blue, 0);
      pawnsSpies[0].pawn.field = normalField0;
      const normalField1 = new NormalField(Color.Blue, 1);
      pawnsSpies[1].pawn.field = normalField1;
      const homeField = new HomeField(Color.Blue);
      pawnsSpies[2].pawn.field = homeField;
      const normalField3 = new NormalField(Color.Blue, 3);
      pawnsSpies[3].pawn.field = normalField3;

      player.movePawnToStartField();

      expect(pawnsSpies[0].moveToNextFieldSpy).not.toHaveBeenCalled();
      expect(pawnsSpies[1].moveToNextFieldSpy).not.toHaveBeenCalled();
      expect(pawnsSpies[2].moveToNextFieldSpy).toHaveBeenCalled();
      expect(pawnsSpies[3].moveToNextFieldSpy).not.toHaveBeenCalled();
    });

    it('should do nothing when no pawns on home field', () => {
      const normalField0 = new NormalField(Color.Blue, 0);
      const normalField1 = new NormalField(Color.Blue, 1);
      const normalField2 = new NormalField(Color.Blue, 2);
      const normalField3 = new NormalField(Color.Blue, 3);

      pawnsSpies[0].pawn.field = normalField0;
      pawnsSpies[1].pawn.field = normalField1;
      pawnsSpies[2].pawn.field = normalField2;
      pawnsSpies[3].pawn.field = normalField3;

      player.movePawnToStartField();
      expect(pawnsSpies[0].moveToNextFieldSpy).not.toHaveBeenCalled();
      expect(pawnsSpies[1].moveToNextFieldSpy).not.toHaveBeenCalled();
      expect(pawnsSpies[2].moveToNextFieldSpy).not.toHaveBeenCalled();
      expect(pawnsSpies[3].moveToNextFieldSpy).not.toHaveBeenCalled();
    });
  });

  describe('movePawnFromStartField()', () => {
    it('should move pawn found on a start field of own color', () => {
      pawnsSpies[0].pawn.field = new NormalField(Color.Blue, 0);
      pawnsSpies[1].pawn.field = new NormalField(Color.Blue, 1);
      pawnsSpies[2].pawn.field = new StartField(Color.Blue);
      pawnsSpies[3].pawn.field = new NormalField(Color.Blue, 2);

      player.rollDice(dice);

      expect(player.movePawnFromStartField()).toBeUndefined();

      expect(pawnsSpies[2].moveToFieldAfterSpy).toHaveBeenCalledWith(
        latestDiceRoll
      );
    });

    it('should not move a pawn when no pawn on start field', () => {
      pawnsSpies[0].pawn.field = new NormalField(Color.Blue, 0);
      pawnsSpies[1].pawn.field = new NormalField(Color.Blue, 1);
      pawnsSpies[2].pawn.field = new LandingField(Color.Blue);
      pawnsSpies[3].pawn.field = new NormalField(Color.Blue, 2);

      player.movePawnFromStartField();
      expect(pawnsSpies[0].moveToFieldAfterSpy).not.toHaveBeenCalled();
      expect(pawnsSpies[1].moveToFieldAfterSpy).not.toHaveBeenCalled();
      expect(pawnsSpies[2].moveToFieldAfterSpy).not.toHaveBeenCalled();
      expect(pawnsSpies[3].moveToFieldAfterSpy).not.toHaveBeenCalled();
    });
  });

  describe('movePawn(pawn)', () => {
    let normalFields: NormalField[];

    beforeEach(() => {
      normalFields = [
        new NormalField(Color.Blue, 0),
        new NormalField(Color.Blue, 1),
        new NormalField(Color.Blue, 2),
      ];
      normalFields[0].next = normalFields[1];
      normalFields[1].next = normalFields[2];

      pawnsSpies[1].pawn.field = normalFields[0];
      normalFields[0].pawn = pawnsSpies[1].pawn;

      player.rollDice(dice);
    });

    it("should throw an error when trying to move another player's pawn", () => {
      expect(() => player.movePawn(otherPlayersPawnSpy.pawn)).toThrowError(
        "Player can only move it's own pawns"
      );
    });

    it('should move the given pawn the number of steps as high as latest dice roll and return beaten pawn on field', () => {
      pawnsSpies[1].moveToFieldAfterSpy.and.returnValue(
        otherPlayersPawnSpy.pawn
      );

      expect(player.movePawn(pawnsSpies[1].pawn)).toBe(
        otherPlayersPawnSpy.pawn
      );
      expect(pawnsSpies[1].moveToFieldAfterSpy).toHaveBeenCalledWith(
        latestDiceRoll
      );
    });
  });

  describe('hasPawnsToMove()', () => {
    it('should return true when at least one of the pawns is on a normal field', () => {
      pawnsSpies[0].pawn.field = new NormalField(Color.Blue, 0);
      pawnsSpies[1].pawn.field = new HomeField(Color.Blue);
      pawnsSpies[2].pawn.field = new HomeField(Color.Blue);
      pawnsSpies[3].pawn.field = new LandingField(Color.Blue);

      expect(player.hasPawnsToMove()).toBeTrue();
    });

    it('should return true when at least one of the pawns is on a start field', () => {
      pawnsSpies[0].pawn.field = new StartField(Color.Blue);
      pawnsSpies[1].pawn.field = new HomeField(Color.Blue);
      pawnsSpies[2].pawn.field = new HomeField(Color.Blue);
      pawnsSpies[3].pawn.field = new LandingField(Color.Blue);

      expect(player.hasPawnsToMove()).toBeTrue();
    });

    it('should return false when all pawns on home field', () => {
      pawnsSpies[0].pawn.field = new HomeField(Color.Blue);
      pawnsSpies[1].pawn.field = new HomeField(Color.Blue);
      pawnsSpies[2].pawn.field = new HomeField(Color.Blue);
      pawnsSpies[3].pawn.field = new HomeField(Color.Blue);

      expect(player.hasPawnsToMove()).toBeFalse();
    });

    it('should return false when all pawns on landing field', () => {
      pawnsSpies[0].pawn.field = new LandingField(Color.Blue);
      pawnsSpies[1].pawn.field = new LandingField(Color.Blue);
      pawnsSpies[2].pawn.field = new LandingField(Color.Blue);
      pawnsSpies[3].pawn.field = new LandingField(Color.Blue);

      expect(player.hasPawnsToMove()).toBeFalse();
    });
  });
});
