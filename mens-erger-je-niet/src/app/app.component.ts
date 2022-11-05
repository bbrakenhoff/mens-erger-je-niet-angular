import { Component } from '@angular/core';
import { Color } from 'models/color';
import { Game } from 'models/game';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public readonly game = new Game();

  public onClickBtnRollDice(): void {
    this.game.currentPlayerRollDice();
  }

  public onClickBtnNextPlayer(): void {
    this.game.nextPlayer();
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
