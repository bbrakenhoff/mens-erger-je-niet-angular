import { Color } from 'models/color';
import { Pawn } from 'models/pawn';
import { Field } from './field';
import { LandingField } from './landing-field';
import { StartField } from './start-field';

export class NormalField implements Field {
  public next!: NormalField | StartField;
  public previous!: NormalField | StartField;
  public landingField: LandingField | undefined;
  public pawn?: Pawn;

  public constructor(
    public readonly color: Color,
    public readonly index: number
  ) {}
}
