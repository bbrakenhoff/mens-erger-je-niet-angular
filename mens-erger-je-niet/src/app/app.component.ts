import { Component } from '@angular/core';
import { Color } from 'models/color';
import { Game } from 'models/game';
import { Pawn } from 'models/pawn';

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

  public onClickPawn(pawn: Pawn): void {
    console.log(
      `%cBijoya app.component.ts[ln:19] onClickPawn`,
      'color: deeppink'
    );
    this.game.currentPlayerMovePawn(pawn);
  }

  public getColorClass(color?: Color): string {
    switch (color) {
      case Color.Blue:
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
