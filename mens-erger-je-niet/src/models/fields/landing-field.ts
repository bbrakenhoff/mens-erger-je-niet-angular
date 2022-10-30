import { Color } from 'models/color';
import { Field } from './field';
import { NormalField } from './normal-field';

export class LandingField extends Field {
  next!: LandingField;
  previous!: LandingField | NormalField;

  constructor(color: Color) {
    super(color);
  }
}
