import { Color } from 'models/color';
import { Pawn } from 'models/pawn';
import { Field } from './field';
import { NormalField } from './normal-field';

export class StartField implements Field {
  public next!: NormalField;
  public previous!: NormalField;
  public pawn?: Pawn;

  public constructor(public readonly color: Color) {}
}
