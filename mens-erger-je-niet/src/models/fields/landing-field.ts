import { Color } from 'models/color';
import { Pawn } from 'models/pawn';
import { Field } from './field';
import { NormalField } from './normal-field';

export class LandingField implements Field {
  next!: LandingField;
  previous!: LandingField | NormalField;
  pawn?: Pawn;

  constructor(readonly color: Color) {}
}
