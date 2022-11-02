import { Color } from './color';
import { Field } from './fields/field';

export class Pawn {
  field!: Field;
  constructor(readonly color: Color) {}

  moveToNextField() {
    const nextField = this.field.next;
    this.field.pawn = undefined;
    this.field = nextField;
    nextField.pawn = this;
  }
}
