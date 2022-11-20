import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Color } from 'models/color';
import { Field } from 'models/fields/field';
import { HomeField } from 'models/fields/home-field';
import { LandingField } from 'models/fields/landing-field';
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

  public get isHomeField(): boolean {
    return this.field instanceof HomeField;
  }

  public get isLandingField(): boolean {
    return this.field instanceof LandingField;
  }

  public onClickPawn(): void {
    console.log(
      `%cBijoya field.component.ts[ln:28] onClickPawn`,
      'color: orange'
    );
    this.pawnClicked.emit(this.field?.pawn);
  }

  public get isPawnEnabled(): boolean {
    return this.field?.pawn?.color !== Color.Blue;
  }
}
