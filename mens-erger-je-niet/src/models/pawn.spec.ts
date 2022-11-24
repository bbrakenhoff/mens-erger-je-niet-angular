import { Color } from './color';
import { Field } from './fields/field';
import { NormalField } from './fields/normal-field';
import { StartField } from './fields/start-field';
import { Pawn } from './pawn';

describe('Pawn', () => {
  let pawn: Pawn;
  let otherPawn: Pawn;

  beforeEach(() => {
    pawn = new Pawn(Color.Blue);
    otherPawn = new Pawn(Color.Red);
  });

  describe('moveTo(newField)', () => {
    it('should move to given field', () => {
      const normalField0 = new NormalField(Color.Yellow, 0);
      const normalField1 = new NormalField(Color.Yellow, 0);
      normalField0.next = normalField1;
      normalField1.previous = normalField0;
      normalField0.pawn = pawn;
      pawn.field = normalField0;

      expect(pawn.moveTo(normalField1)).toBeUndefined();

      expect(pawn.field).toBe(normalField1);
      expect(normalField1.pawn).toBe(pawn);
      expect(normalField0.pawn).toBeUndefined();
    });

    it('should beat another pawn when field already occupied', () => {
      const normalField0 = new NormalField(Color.Yellow, 0);
      const normalField1 = new NormalField(Color.Yellow, 0);
      normalField0.next = normalField1;
      normalField1.previous = normalField0;

      normalField0.pawn = pawn;
      pawn.field = normalField0;

      normalField1.pawn = otherPawn;
      otherPawn.field = normalField1;

      expect(pawn.moveTo(normalField1)).toBe(otherPawn);
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

      expect(pawn.moveToNextField()).toBeUndefined();
      expect(pawn.field).toBe(normalField);
      expect(normalField.pawn).toBe(pawn);
      expect(startField.pawn).toBeUndefined();
    });

    it('should beat another pawn and move a pawn to the next field', () => {
      const startField = new StartField(Color.Red);
      const normalField = new NormalField(Color.Yellow, 0);
      startField.next = normalField;
      normalField.previous = startField;

      startField.pawn = pawn;
      pawn.field = startField;

      normalField.pawn = otherPawn;
      otherPawn.field = normalField;

      expect(pawn.moveToNextField()).toBe(otherPawn);
      expect(pawn.field).toBe(normalField);
      expect(normalField.pawn).toBe(pawn);
      expect(startField.pawn).toBeUndefined();
    });
  });

  describe('moveToFieldAfter(steps)', () => {
    let fields: Field[];
    const steps = 5;

    beforeEach(() => {
      fields = [
        new StartField(Color.Yellow),
        new NormalField(Color.Yellow, 0),
        new NormalField(Color.Yellow, 1),
        new NormalField(Color.Yellow, 2),
        new NormalField(Color.Yellow, 3),
        new NormalField(Color.Yellow, 4),
        new NormalField(Color.Yellow, 5),
      ];

      fields.forEach((field, i) => {
        if (i < fields.length - 2) {
          field.next = fields[i + 1];
        }
      });

      fields[0].pawn = pawn;
      pawn.field = fields[0];
    });

    fit('should go to the field in the given number of steps', () => {
      expect(pawn.moveToFieldAfter(steps)).toBeUndefined();

      expect(pawn.field).toBe(fields[5]);
      expect(fields[5].pawn).toBe(pawn);
      expect(fields[0].pawn).toBeUndefined();
    });

    it('should beat another pawn when field already occupied', () => {
      otherPawn.field = fields[4];
      fields[4].pawn = otherPawn;

      expect(pawn.moveToFieldAfter(steps)).toBe(otherPawn);

      expect(pawn.field).toBe(fields[4]);
      expect(fields[4].pawn).toBe(pawn);
      expect(fields[0].pawn).toBeUndefined();
    });
  });
});
