import { Color } from './color';
import { Field } from './field';
import { StartField } from './start-field';

export class LandingField extends Field {
  constructor(
    color: Color,
  ) {
    super(color);
  }
}
