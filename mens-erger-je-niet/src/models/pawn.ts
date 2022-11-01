import { Color } from './color';
import { Field } from './fields/field';

export class Pawn {
  field: Field | undefined;
  constructor(readonly color: Color) {}
}
