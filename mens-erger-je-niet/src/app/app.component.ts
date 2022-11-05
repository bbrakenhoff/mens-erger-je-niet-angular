import { Component } from '@angular/core';
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
}
