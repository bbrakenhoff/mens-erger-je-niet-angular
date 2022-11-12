import { Color } from './color';
import { Dice } from './dice';
import { HomeField } from './fields/home-field';
import { LandingField } from './fields/landing-field';
import { NormalField } from './fields/normal-field';
import { StartField } from './fields/start-field';
import { Pawn } from './pawn';
import { Player } from './player';

describe('Player', () => {
  let pawns: Pawn[];
  let player: Player;

  beforeEach(() => {
    pawns = [
      new Pawn(Color.Blue),
      new Pawn(Color.Blue),
      new Pawn(Color.Blue),
      new Pawn(Color.Blue),
    ];
    pawns.forEach((pawn) => {
      spyOn(pawn, 'moveTo');
      spyOn(pawn, 'moveFurther');
      spyOn(pawn, 'moveToNextField');
    });

    player = new Player();
    player.pawns.push(...pawns);
  });

  describe('pawnColor', () => {
    it('should return the color of the pawns', () => {
      expect(player.pawnColor).toBe(pawns[0].color);
    });
  });

  describe('putPawnOnHomeField', () => {
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
      homeFields[0].pawn = pawns[1];
      homeFields[1].pawn = pawns[3];
      homeFields[2].pawn = pawns[0];

      player.putPawnOnHomeField(pawns[3], homeFields);
      expect(pawns[3].moveTo).toHaveBeenCalledWith(homeFields[3]);
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
      expect(pawns[0].moveTo).toHaveBeenCalledWith(homeFields[0]);
      expect(pawns[1].moveTo).toHaveBeenCalledWith(homeFields[1]);
      expect(pawns[2].moveTo).toHaveBeenCalledWith(homeFields[2]);
      expect(pawns[3].moveTo).toHaveBeenCalledWith(homeFields[3]);
    });
  });

  describe('rollDice(dice)', () => {
    it('should roll the dice and remember number of eyes rolled', () => {
      const dice: Dice = new Dice();
      spyOn(dice, 'roll').and.returnValue(3);
      player.rollDice(dice);
      expect(player.latestDiceRoll).toBe(3);
    });
  });

  describe('movePawnToStartField()', () => {
    it('should move the first pawn found on a home field to start field', () => {
      const normalField0 = new NormalField(Color.Blue, 0);
      pawns[0].field = normalField0;
      const normalField1 = new NormalField(Color.Blue, 1);
      pawns[1].field = normalField1;
      const homeField = new HomeField(Color.Blue);
      pawns[2].field = homeField;
      const normalField3 = new NormalField(Color.Blue, 3);
      pawns[3].field = normalField3;

      player.movePawnToStartField();

      expect(pawns[0].moveToNextField).not.toHaveBeenCalled();
      expect(pawns[1].moveToNextField).not.toHaveBeenCalled();
      expect(pawns[2].moveToNextField).toHaveBeenCalled();
      expect(pawns[3].moveToNextField).not.toHaveBeenCalled();
    });

    it('should do nothing when no pawns on home field', () => {
      const normalField0 = new NormalField(Color.Blue, 0);
      const normalField1 = new NormalField(Color.Blue, 1);
      const normalField2 = new NormalField(Color.Blue, 2);
      const normalField3 = new NormalField(Color.Blue, 3);

      pawns[0].field = normalField0;
      pawns[1].field = normalField1;
      pawns[2].field = normalField2;
      pawns[3].field = normalField3;

      player.movePawnToStartField();
      expect(pawns[0].moveToNextField).not.toHaveBeenCalled();
      expect(pawns[1].moveToNextField).not.toHaveBeenCalled();
      expect(pawns[2].moveToNextField).not.toHaveBeenCalled();
      expect(pawns[3].moveToNextField).not.toHaveBeenCalled();
    });
  });

  describe('movePawnFromStartField()', () => {
    it('should move pawn found on a start field of own color', () => {
      pawns[0].field = new NormalField(Color.Blue, 0);
      pawns[1].field = new NormalField(Color.Blue, 1);
      pawns[2].field = new StartField(Color.Blue);
      pawns[3].field = new NormalField(Color.Blue, 2);

      const dice: Dice = new Dice();
      spyOn(dice, 'roll').and.returnValue(3);
      player.rollDice(dice);
      player.movePawnFromStartField();

      expect(pawns[2].moveFurther).toHaveBeenCalledWith(3);
    });

    it('should not move a pawn when pawn found on a start field of other color', () => {
      pawns[0].field = new NormalField(Color.Blue, 0);
      pawns[1].field = new NormalField(Color.Blue, 1);
      pawns[2].field = new StartField(Color.Green);
      pawns[3].field = new NormalField(Color.Blue, 2);

      player.movePawnFromStartField();
      expect(pawns[0].moveFurther).not.toHaveBeenCalled();
      expect(pawns[1].moveFurther).not.toHaveBeenCalled();
      expect(pawns[2].moveFurther).not.toHaveBeenCalled();
      expect(pawns[3].moveFurther).not.toHaveBeenCalled();
    });

    it('should not move a pawn when no pawn on start field', () => {
      pawns[0].field = new NormalField(Color.Blue, 0);
      pawns[1].field = new NormalField(Color.Blue, 1);
      pawns[2].field = new LandingField(Color.Blue);
      pawns[3].field = new NormalField(Color.Blue, 2);

      player.movePawnFromStartField();
      expect(pawns[0].moveFurther).not.toHaveBeenCalled();
      expect(pawns[1].moveFurther).not.toHaveBeenCalled();
      expect(pawns[2].moveFurther).not.toHaveBeenCalled();
      expect(pawns[3].moveFurther).not.toHaveBeenCalled();
    });
  });

  fdescribe('movePawn(pawn)', () => {
    let normalFields: NormalField[];
    let otherPawn: Pawn;

    beforeEach(() => {
      otherPawn = new Pawn(Color.Blue);

      normalFields = [
        new NormalField(Color.Blue, 0),
        new NormalField(Color.Blue, 1),
        new NormalField(Color.Blue, 2),
      ];
      normalFields[0].next = normalFields[1];
      normalFields[1].next = normalFields[2];

      pawns[1].field = normalFields[0];
      normalFields[0].pawn = pawns[1];
    });

    it("should throw an error when trying to move another player's pawn", () => {
      expect(() => player.movePawn(otherPawn)).toThrowError(
        "Player can only move it's own pawns"
      );
    });

    it('should move the given pawn and return undefined when no pawn on field', () => {
      expect(player.movePawn(pawns[1])).toBeUndefined();
      expect(pawns[1].moveTo).toHaveBeenCalledWith(normalFields[2]);
    });

    it('should move the given pawn and return the pawn already on field', () => {
      normalFields[2].pawn = otherPawn;
      otherPawn.field = normalFields[2];

      expect(player.movePawn(pawns[1])).toBe(otherPawn);
      expect(pawns[1].moveTo).toHaveBeenCalledWith(normalFields[2]);
    });
  });

  describe('hasPawnsToMove()', () => {
    it('should return true when at least one of the pawns is on a normal field', () => {
      pawns[0].field = new NormalField(Color.Blue, 0);
      pawns[1].field = new HomeField(Color.Blue);
      pawns[2].field = new HomeField(Color.Blue);
      pawns[3].field = new LandingField(Color.Blue);

      expect(player.hasPawnsToMove()).toBeTrue();
    });

    it('should return true when at least one of the pawns is on a start field', () => {
      pawns[0].field = new StartField(Color.Blue);
      pawns[1].field = new HomeField(Color.Blue);
      pawns[2].field = new HomeField(Color.Blue);
      pawns[3].field = new LandingField(Color.Blue);

      expect(player.hasPawnsToMove()).toBeTrue();
    });

    it('should return false when all pawns on home field', () => {
      pawns[0].field = new HomeField(Color.Blue);
      pawns[1].field = new HomeField(Color.Blue);
      pawns[2].field = new HomeField(Color.Blue);
      pawns[3].field = new HomeField(Color.Blue);

      expect(player.hasPawnsToMove()).toBeFalse();
    });

    it('should return false when all pawns on landing field', () => {
      pawns[0].field = new LandingField(Color.Blue);
      pawns[1].field = new LandingField(Color.Blue);
      pawns[2].field = new LandingField(Color.Blue);
      pawns[3].field = new LandingField(Color.Blue);

      expect(player.hasPawnsToMove()).toBeFalse();
    });
  });
});
