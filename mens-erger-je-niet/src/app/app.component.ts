import { Component } from '@angular/core';
import { Game } from 'models/game';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly game = new Game();

  onClickBtnRollDice() {
    this.game.currentPlayerRollDice();
  }

  onClickBtnNextPlayer() {
    this.game.nextPlayer();
  }
}
