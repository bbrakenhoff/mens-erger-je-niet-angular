import { allColors } from './color';
import { HomeField } from './home-field';
import { LandingField } from './landing-field';

export class Board {
  readonly homeFields: HomeField[][] = [];
  readonly landingFields: LandingField[][] = [];

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
      this.homeFields.push(homeFieldsForPlayer);
    });
  }

  private createLandingFields() {
    allColors.forEach((color) => {
      const landingFieldsForPlayer: LandingField[] = [];
      for (let i = 0; i < 4; i++) {
        landingFieldsForPlayer.push(new LandingField(color));
      }
      this.landingFields.push(landingFieldsForPlayer);
    });
  }
}
