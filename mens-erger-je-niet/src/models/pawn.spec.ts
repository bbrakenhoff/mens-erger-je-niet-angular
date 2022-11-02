import { Color } from './color';
import { NormalField } from './fields/normal-field';
import { StartField } from './fields/start-field';
import { Pawn } from './pawn';

describe('Pawn', () => {
  describe('moveToNextField()', () => {
    it('should move a pawn to the next field', () => {
      const pawn = new Pawn(Color.Black);
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
});
