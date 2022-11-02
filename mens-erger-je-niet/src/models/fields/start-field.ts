import { Color } from 'models/color';
import { Pawn } from 'models/pawn';
import { Field } from './field';
import { NormalField } from './normal-field';

export class StartField implements Field {
  next!: NormalField;
  previous!: NormalField;
  pawn?: Pawn;

  constructor(readonly color: Color) {}
}
