import { Component, Input } from '@angular/core';
import { Field } from 'models/fields/field';
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

  public get isStartField(): boolean {
    return this.field instanceof StartField;
  }

  public get isNormalField(): boolean {
    return this.field instanceof NormalField;
  }

  public get index(): string {
    return this.field instanceof NormalField
      ? `${(this.field as NormalField).index}`
      : '';
  }
}
