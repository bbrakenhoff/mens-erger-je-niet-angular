import { Color } from 'models/color';
import { Field } from './field';
import { LandingField } from './landing-field';
import { StartField } from './start-field';

export class NormalField extends Field {
  next!: NormalField | StartField;
  previous!: NormalField | StartField;
  landingField: LandingField | undefined;

  constructor(color: Color) {
    super(color);
  }
}
