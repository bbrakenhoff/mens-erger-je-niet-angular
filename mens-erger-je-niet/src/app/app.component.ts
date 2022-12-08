import { Component } from '@angular/core';
import { Game } from 'models/game';
import { Pawn } from 'models/pawn';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public readonly game = new Game();
  public readonly gameEventMessage$ = of();

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
}
