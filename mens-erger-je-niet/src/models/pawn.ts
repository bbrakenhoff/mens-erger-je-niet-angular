import { Color } from './color';
import { Field } from './fields/field';

export class Pawn {
  public field!: Field;
  public constructor(public readonly color: Color) {}

  public goToField(nextField: Field): void {
    if (this.field) {
      this.field.pawn = undefined;
    }
    
    this.field = nextField;
    nextField.pawn = this;
  }

  public moveToNextField(): void {
    const nextField = this.field.next;
    this.goToField(nextField);
  }
}
