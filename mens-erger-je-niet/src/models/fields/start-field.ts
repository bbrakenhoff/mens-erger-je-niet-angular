import { Color } from 'models/color';
import { Field } from './field';
import { NormalField } from './normal-field';

export class StartField extends Field {
  next!: NormalField;
  previous!: NormalField;

  constructor(color: Color) {
    super(color);
  }
}
