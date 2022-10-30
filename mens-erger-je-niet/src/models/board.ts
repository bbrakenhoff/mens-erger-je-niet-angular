import { allColors, Color } from './color';
import { HomeField } from './fields/home-field';
import { LandingField } from './fields/landing-field';
import { NormalField } from './fields/normal-field';
import { StartField } from './fields/start-field';

// HH..nnS..HH
// HH..nLn..HH
// ....nLn....
// ....nLn....
// SnnnnLnnnnn
// nLLLL.LLLLn
// nnnnnLnnnnS
// ....nLn....
// ....nLn....
// HH..nLn..HH
// HH..Snn..HH

export class Board {
  readonly homeFields = new Map<Color, HomeField[]>();
  readonly landingFields = new Map<Color, LandingField[]>();
  readonly startFields = new Map<Color, StartField>();
  readonly normalFields = new Map<Color, NormalField[]>();

  constructor() {
    this.createHomeFields();
    this.createLandingFields();
    this.connectLandingFieldsTogether();
    this.createStartFields();
    this.createNormalFields();
    this.connectNormalFieldsTogether();
    this.connectNormalFieldToLandingField();
    this.connectStartFieldToNormalFields();
  }

  private createHomeFields() {
    allColors.forEach((color) => {
      const homeFieldsForPlayer: HomeField[] = [];
      for (let i = 0; i < 4; i++) {
        homeFieldsForPlayer.push(new HomeField(color));
      }
      this.homeFields.set(color, homeFieldsForPlayer);
    });
  }

  private createLandingFields() {
    allColors.forEach((color) => {
      const landingFieldsForPlayer: LandingField[] = [];
      for (let i = 0; i < 4; i++) {
        landingFieldsForPlayer.push(new LandingField(color));
      }
      this.landingFields.set(color, landingFieldsForPlayer);
    });
  }

  private connectLandingFieldsTogether() {
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

  private createStartFields() {
    allColors.forEach((color) => {
      const startField = new StartField(color);
      this.homeFields
        .get(color)
        ?.forEach((homeField) => (homeField.next = startField));
      this.startFields.set(color, startField);
    });
  }

  private createNormalFields() {
    allColors.forEach((color) => {
      const normalFieldsForPlayer: NormalField[] = [];
      for (let i = 0; i < 7; i++) {
        normalFieldsForPlayer.push(new NormalField(color));
      }
      this.normalFields.set(color, normalFieldsForPlayer);
    });
  }

  private connectNormalFieldsTogether() {
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

  private connectNormalFieldToLandingField() {
    this.normalFields.forEach((normalFielsForPlayer, color) => {
      normalFielsForPlayer[0].landingField = this.landingFields.get(color)![0];
      this.landingFields.get(color)![0].previous = normalFielsForPlayer[0];
    });
  }

  private connectStartFieldToNormalFields() {
    this.startFields.forEach((startField, color) => {
      startField.next = this.normalFields.get(color)![0];
      this.normalFields.get(color)![0].previous = startField;
      startField.previous = this.normalFields.get(Board.nextColor(color))![6];
      this.normalFields.get(Board.nextColor(color))![6].next = startField;
    });
  }

  private static nextColor(color: Color) {
    if (color === Color.Yellow) {
      return Color.Black;
    }

    return color + 1;
  }
}
