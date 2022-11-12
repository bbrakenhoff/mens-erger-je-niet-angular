import { Color } from './color';
import { Field } from './fields/field';

export class Pawn {
  public field!: Field;
  public constructor(public readonly color: Color) {}

  public moveTo(newField: Field): Pawn | undefined {
    if (this.field) {
      this.field.pawn = undefined;
    }

    const beatenPawn = newField.pawn;
    this.field = newField;
    this.field.pawn = this;

    return beatenPawn;
  }

  public moveToFieldAfter(steps: number): Pawn | undefined {
    let fieldToMoveTo = this.field;

    for (let step = 0; step < steps; step++) {
      fieldToMoveTo = fieldToMoveTo.next;
    }

    return this.moveTo(fieldToMoveTo);
  }

  public moveToNextField(): Pawn | undefined {
    return this.moveTo(this.field.next);
  }
}
