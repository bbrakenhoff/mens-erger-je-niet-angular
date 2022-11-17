import { Color } from './color';
import { HomeField } from './fields/home-field';
import { LandingField } from './fields/landing-field';
import { NormalField } from './fields/normal-field';
import { StartField } from './fields/start-field';

export class FieldGroup {
  private readonly _homeFields: Array<HomeField> = [];
  public get homeFields(): ReadonlyArray<HomeField> {
    return this._homeFields;
  }

  private readonly _landingFields: LandingField[] = [];
  public get landingFields(): ReadonlyArray<LandingField> {
    return this._landingFields;
  }

  public readonly startField: StartField;
  private readonly _normalFields: NormalField[] = [];

  public get normalFields(): ReadonlyArray<NormalField> {
    return this._normalFields;
  }

  public constructor(public readonly color: Color) {
    this.startField = new StartField(color);
    this.createHomeFields();
    this.createLandingFields();
    this.createNormalFields();

    this.chainHomeFieldsToStartField();
    this.chainNormalFields();
    this.chainNormalFieldToLandingField();
    this.chainStartFieldToFirstNormalField();
  }

  private createHomeFields(): void {
    for (let i = 0; i < 4; i++) {
      this._homeFields.push(new HomeField(this.color));
    }
  }

  private chainHomeFieldsToStartField(): void {
    this.homeFields.forEach((homeField) => {
      homeField.next = this.startField;
    });
  }

  private createLandingFields(): void {
    for (let i = 0; i < 4; i++) {
      this._landingFields.push(new LandingField(this.color));
    }

    this.chainLandingFields();
  }

  private chainLandingFields(): void {
    this.landingFields.forEach((landingField, i) => {
      if (i > 0) {
        // First landing field does not have a previous LandingField
        landingField.previous = this.landingFields[i - 1];
      }
      if (i < this.landingFields.length - 1) {
        // Last landing field does not have a next LandingField
        landingField.next = this.landingFields[i + 1];
      }
    });
  }

  private createNormalFields(): void {
    for (let i = 0; i < 9; i++) {
      this._normalFields.push(new NormalField(this.color, i));
    }
  }

  private chainNormalFields(): void {
    this.normalFields.forEach((landingField, i) => {
      if (i > 0) {
        // First landing field does not have a previous LandingField
        landingField.previous = this.normalFields[i - 1];
      }
      if (i < this.normalFields.length - 1) {
        // Last landing field does not have a next LandingField
        landingField.next = this.normalFields[i + 1];
      }
    });
  }

  private chainNormalFieldToLandingField(): void {
    this.normalFields[0].landingField = this.landingFields[0];
    this.landingFields[0].previous = this.normalFields[0];
  }

  private chainStartFieldToFirstNormalField(): void {
    this.startField.next = this.normalFields[0];
    this.normalFields[0].previous = this.startField;
  }
}
