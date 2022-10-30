import { Color } from 'models/color';
import { Field } from './field';
import { StartField } from './start-field';

export class HomeField extends Field {
  next!: StartField;

  constructor(color: Color) {
    super(color);
  }
}
