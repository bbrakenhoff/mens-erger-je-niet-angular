import { Color } from 'models/color';
import { Pawn } from 'models/pawn';
import { Field } from './field';
import { StartField } from './start-field';

export class HomeField implements Field {
 public  next!: StartField;
 public  previous!: Field;
 public  pawn?: Pawn;

  public constructor(public readonly color: Color) {}
}
