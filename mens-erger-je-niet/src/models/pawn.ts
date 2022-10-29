import { Color } from './color';
import { Field } from './field';

export class Pawn {
  field: Field | null = null;
  constructor(readonly color: Color) {}
}
