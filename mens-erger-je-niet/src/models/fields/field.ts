import { Color } from 'models/color';
import { Pawn } from 'models/pawn';

export abstract class Field {
  pawn: Pawn|undefined;

  constructor(readonly color: Color) {}
}
