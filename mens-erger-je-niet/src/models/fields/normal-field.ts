import { Color } from 'models/color';
import { Pawn } from 'models/pawn';
import { Field } from './field';
import { LandingField } from './landing-field';
import { StartField } from './start-field';

export class NormalField implements Field {
  next!: NormalField | StartField;
  previous!: NormalField | StartField;
  landingField: LandingField | undefined;
  pawn?: Pawn;

  constructor(readonly color: Color, readonly index: number) {}
}
