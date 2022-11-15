import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Field } from 'models/fields/field';
import { NormalField } from 'models/fields/normal-field';
import { StartField } from 'models/fields/start-field';
import { Pawn } from 'models/pawn';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
})
export class FieldComponent {
  @Input()
  public field?: Field;

  @Output()
  public pawnClicked = new EventEmitter<Pawn>();

  public get isStartField(): boolean {
    return this.field instanceof StartField;
  }

  public get isNormalField(): boolean {
    return this.field instanceof NormalField;
  }

  public onClickPawn(): void {
    console.log(
      `%cBijoya field.component.ts[ln:28] onClickPawn`,
      'color: orange'
    );
    this.pawnClicked.emit(this.field?.pawn);
  }
}
