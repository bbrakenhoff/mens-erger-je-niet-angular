import { Pipe, PipeTransform } from '@angular/core';
import { Color } from 'models/color';

@Pipe({
  name: 'pawnColor',
})
export class PawnColorPipe implements PipeTransform {
  public transform(
    value: Color | undefined
  ): string {
    if (value) {
      return `${value}`;
    }
    return '';
  }
}
