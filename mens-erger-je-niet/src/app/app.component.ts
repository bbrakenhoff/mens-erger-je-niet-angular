import { Component } from '@angular/core';
import { FirstPlayerDeterminer } from 'models/first-player-determiner';
import { Pawn } from 'models/pawn';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private readonly firstPlayerDeterminer = new FirstPlayerDeterminer();

  public readonly diceRoll$: Observable<{
    playerIndex: number;
    diceRoll: number;
  }> = this.firstPlayerDeterminer.currentPlayerDiceRoll$;
  public readonly firstPlayerIndex$: Observable<number> =
    this.firstPlayerDeterminer.firstPlayerIndex$;

  public onRollButtonClick(): void {
    this.firstPlayerDeterminer.currentPlayerRollDice();
  }
}
