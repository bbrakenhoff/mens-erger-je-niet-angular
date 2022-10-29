import { Color } from './color';
import { Field } from './field';
import { LandingField } from './landing-field';
import { Pawn } from './pawn';

export class StartField extends Field {
  constructor(color: Color) {
    super(color);
  }
}
