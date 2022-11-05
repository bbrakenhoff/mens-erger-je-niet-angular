import { allColors, Color } from './color';
import { HomeField } from './fields/home-field';
import { LandingField } from './fields/landing-field';
import { NormalField } from './fields/normal-field';
import { StartField } from './fields/start-field';

export class Board {
  public readonly homeFields = new Map<Color, HomeField[]>();
  public readonly landingFields = new Map<Color, LandingField[]>();
  public readonly startFields = new Map<Color, StartField>();
  public readonly normalFields = new Map<Color, NormalField[]>();

  public constructor() {
    this.createHomeFields();
    this.createLandingFields();
    this.connectLandingFieldsTogether();
    this.createStartFields();
    this.createNormalFields();
    this.connectNormalFieldsTogether();
    this.connectNormalFieldToLandingField();
    this.connectStartFieldToNormalFields();
  }

  private createHomeFields(): void {
    allColors.forEach((color) => {
      const homeFieldsForPlayer: HomeField[] = [];
      for (let i = 0; i < 4; i++) {
        homeFieldsForPlayer.push(new HomeField(color));
      }
      this.homeFields.set(color, homeFieldsForPlayer);
    });
  }

  private createLandingFields(): void {
    allColors.forEach((color) => {
      const landingFieldsForPlayer: LandingField[] = [];
      for (let i = 0; i < 4; i++) {
        landingFieldsForPlayer.push(new LandingField(color));
      }
      this.landingFields.set(color, landingFieldsForPlayer);
    });
  }

  private connectLandingFieldsTogether(): void {
    this.landingFields.forEach((landingFieldsForPlayer) => {
      landingFieldsForPlayer.forEach((landingField, i) => {
        if (i > 0) {
          // First landing field does not have a previous LandingField
          landingField.previous = landingFieldsForPlayer[i - 1];
        }
        if (i < landingFieldsForPlayer.length - 1) {
          // Last landing field does not have a next LandingField
          landingField.next = landingFieldsForPlayer[i + 1];
        }
      });
    });
  }

  private createStartFields(): void {
    allColors.forEach((color) => {
      const startField = new StartField(color);
      this.homeFields
        .get(color)
        ?.forEach((homeField) => (homeField.next = startField));
      this.startFields.set(color, startField);
    });
  }

  private createNormalFields(): void {
    allColors.forEach((color) => {
      const normalFieldsForPlayer: NormalField[] = [];
      for (let i = 0; i < 9; i++) {
        normalFieldsForPlayer.push(new NormalField(color, i));
      }
      this.normalFields.set(color, normalFieldsForPlayer);
    });
  }

  private connectNormalFieldsTogether(): void {
    this.normalFields.forEach((normalFieldsForPlayer) => {
      normalFieldsForPlayer.forEach((landingField, i) => {
        if (i > 0) {
          // First landing field does not have a previous LandingField
          landingField.previous = normalFieldsForPlayer[i - 1];
        }
        if (i < normalFieldsForPlayer.length - 1) {
          // Last landing field does not have a next LandingField
          landingField.next = normalFieldsForPlayer[i + 1];
        }
      });
    });
  }

  private connectNormalFieldToLandingField(): void {
    this.normalFields.forEach((normalFielsForPlayer, color) => {
      normalFielsForPlayer[0].landingField = this.landingFields.get(color)![0];
      this.landingFields.get(color)![0].previous = normalFielsForPlayer[0];
    });
  }

  private connectStartFieldToNormalFields(): void {
    this.startFields.forEach((startField, color) => {
      startField.next = this.normalFields.get(color)![0];
      this.normalFields.get(color)![0].previous = startField;
      startField.previous = this.normalFields.get(Board.nextColor(color))![8];
      this.normalFields.get(Board.nextColor(color))![8].next = startField;
    });
  }

  private static nextColor(color: Color): Color {
    if (color === Color.Yellow) {
      return Color.Black;
    }

    return color + 1;
  }
}
