import { allColors, Color } from "./color";
import { HomeField } from "./fields/home-field";
import { LandingField } from "./fields/landing-field";

export class Board {
  readonly homeFields: Map<Color, HomeField[]> = new Map();
  readonly landingFields: Map<Color, LandingField[]> = new Map();

  constructor() {
    this.createHomeFields();
    this.createLandingFields();
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
}
