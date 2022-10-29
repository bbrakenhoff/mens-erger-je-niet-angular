import { Color } from './color';
import { Pawn } from './pawn';

export abstract class Field {
  pawn: Pawn | null = null;

  constructor(readonly color: Color) {}
}
