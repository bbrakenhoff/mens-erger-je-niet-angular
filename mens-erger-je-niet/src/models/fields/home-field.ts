import { Color } from 'models/color';
import { Pawn } from 'models/pawn';
import { Field } from './field';
import { StartField } from './start-field';

export class HomeField implements Field {
  next!: StartField;
  previous!: Field;
  pawn?: Pawn;

  constructor(readonly color: Color) {}
}
