import { Color } from './color';
import { Field } from './fields/field';

export class Pawn {
  public field!: Field;
  public constructor(public readonly color: Color) {}

  public moveTo(newField: Field): void {
    if (this.field) {
      this.field.pawn = undefined;
    }

    this.field = newField;
    this.field.pawn = this;
  }

  public moveFurther(steps: number): void {
    let fieldToMoveTo = this.field;

    for (let step = 0; step < steps; step++) {
      fieldToMoveTo = fieldToMoveTo.next;
    }

    this.moveTo(fieldToMoveTo);
  }

  public moveToNextField(): void {
    this.moveTo(this.field.next);
  }
}
