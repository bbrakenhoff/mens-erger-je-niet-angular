import { Color } from 'models/color';
import { Pawn } from 'models/pawn';

export interface Field {
  color: Color;
  next: Field;
  previous: Field;
  pawn?: Pawn;
}
