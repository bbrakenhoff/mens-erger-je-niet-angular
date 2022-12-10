import { Component } from '@angular/core';
import { Pawn } from 'models/pawn';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // public readonly game = new BoardGame();
  // public readonly gameEventMessage$ = of();

  public onClickBtnRollDice(): void {
    // this.game.currentPlayerRollDice();
  }

  public onClickPawn(pawn: Pawn): void {
    console.log(
      `%cBijoya app.component.ts[ln:19] onClickPawn`,
      'color: deeppink'
    );
    // this.game.currentPlayerMovePawn(pawn);
  }
}
