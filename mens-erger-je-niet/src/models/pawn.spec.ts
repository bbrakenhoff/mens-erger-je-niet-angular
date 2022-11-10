import { Color } from './color';
import { NormalField } from './fields/normal-field';
import { StartField } from './fields/start-field';
import { Pawn } from './pawn';

describe('Pawn', () => {
  let pawn: Pawn;

  beforeEach(() => {
    pawn = new Pawn(Color.Blue);
  });

  describe('moveTo(newField)', () => {
    it('should move to given field', () => {
      const normalField0 = new NormalField(Color.Yellow, 0);
      const normalField1 = new NormalField(Color.Yellow, 0);
      normalField0.next = normalField1;
      normalField1.previous = normalField0;
      normalField0.pawn = pawn;
      pawn.field = normalField0;

      pawn.moveTo(normalField1);

      expect(pawn.field).toBe(normalField1);
      expect(normalField1.pawn).toBe(pawn);
      expect(normalField0.pawn).toBeUndefined();
    });
  });

  describe('moveToNextField()', () => {
    it('should move a pawn to the next field', () => {
      const startField = new StartField(Color.Red);
      const normalField = new NormalField(Color.Yellow, 0);
      startField.next = normalField;
      normalField.previous = startField;

      startField.pawn = pawn;
      pawn.field = startField;

      pawn.moveToNextField();
      expect(pawn.field).toBe(normalField);
      expect(normalField.pawn).toBe(pawn);
      expect(startField.pawn).toBeUndefined();
    });
  });

  describe('moveFurther(steps)', () => {
    it('should move the given number of steps further', () => {
      const normalField0 = new NormalField(Color.Yellow, 0);
      const normalField1 = new NormalField(Color.Yellow, 1);
      const normalField2 = new NormalField(Color.Yellow, 2);
      const normalField3 = new NormalField(Color.Yellow, 3);
      const normalField4 = new NormalField(Color.Yellow, 4);
      const normalField5 = new NormalField(Color.Yellow, 5);
      const normalField6 = new NormalField(Color.Yellow, 6);
      normalField0.next = normalField1;
      normalField1.next = normalField2;
      normalField2.next = normalField3;
      normalField3.next = normalField4;
      normalField4.next = normalField5;
      normalField5.next = normalField6;

      normalField0.pawn = pawn;
      pawn.field = normalField0;

      pawn.moveFurther(5)
      expect(pawn.field).toBe(normalField5);
      expect(normalField5.pawn).toBe(pawn);
      expect(normalField0.pawn).toBeUndefined();
      expect(normalField1.pawn).toBeUndefined();
      expect(normalField2.pawn).toBeUndefined();
      expect(normalField3.pawn).toBeUndefined();
      expect(normalField4.pawn).toBeUndefined();
      expect(normalField6.pawn).toBeUndefined();
    });
  });
});
