import { Color } from 'models/color';
import { Pawn } from 'models/pawn';
import { Field } from './field';
import { NormalField } from './normal-field';

export class LandingField implements Field {
 public next!: LandingField;
 public previous!: LandingField | NormalField;
 public pawn?: Pawn;

public  constructor(public readonly color: Color) {}
}
