import { Color } from 'models/color';
import { Field } from './field';

export class LandingField extends Field {
  constructor(
    color: Color,
  ) {
    super(color);
  }
}
