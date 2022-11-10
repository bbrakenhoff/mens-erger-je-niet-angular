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

    player = new Player()
    player.pawns.push(...pawns);
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

  describe('movePawn(pawn)', () => {
    it("should throw an error when trying to move another player's pawn", () => {
      const otherPawn = new Pawn(Color.Blue);
      expect(() => player.movePawn(otherPawn)).toThrowError(
        "Player can only move it's own pawns"
      );
    });

    it('should move the given pawn', () => {
      pawns[0].field = new NormalField(Color.Blue, 0);
      player.movePawn(pawns[0]);
      expect(pawns[0].moveToNextField).toHaveBeenCalled();
      expect(pawns[1].moveToNextField).not.toHaveBeenCalled();
      expect(pawns[2].moveToNextField).not.toHaveBeenCalled();
      expect(pawns[3].moveToNextField).not.toHaveBeenCalled();
    });
  });
});
