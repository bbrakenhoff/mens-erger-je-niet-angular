import { Component } from '@angular/core';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly game = new Game();

  onClickRollDice() {
  }
}
