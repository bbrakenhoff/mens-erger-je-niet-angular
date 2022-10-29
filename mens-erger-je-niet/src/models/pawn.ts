import { Color } from './color';
import { Field } from './fields/field';

export class Pawn {
  field: Field | null = null;
  constructor(readonly color: Color) {}
}
