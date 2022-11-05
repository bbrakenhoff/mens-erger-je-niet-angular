import { Component, Input } from '@angular/core';
import { Color } from 'models/color';
import { Field } from 'models/fields/field';
import { HomeField } from 'models/fields/home-field';
import { LandingField } from 'models/fields/landing-field';
import { NormalField } from 'models/fields/normal-field';
import { StartField } from 'models/fields/start-field';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
})
export class FieldComponent {
  @Input()
  public field?: Field;

  public get index(): string {
    return this.field instanceof NormalField
      ? `${(this.field as NormalField).index}`
      : '';
  }

  public getFieldClass(): string {
    if (this.field instanceof StartField) {
      return `start-field ${this.getColorClass(this.field.color)}-border`;
    } else if (
      this.field instanceof HomeField ||
      this.field instanceof LandingField
    ) {
      return this.getColorClass(this.field?.color);
    } else if (this.field instanceof NormalField) {
      return `${this.getColorClass(this.field?.color)} lighten`;
    }
    return '';
  }

  public getColorClass(color?: Color): string {
    switch (color) {
      case Color.Black:
        return 'black';
      case Color.Green:
        return 'green';
      case Color.Red:
        return 'red';
      case Color.Yellow:
        return 'yellow';
      default:
        return '';
    }
  }
}
