import { Component } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DetermineFirstPlayerService } from './determine-first-player.service';

@Component({
  selector: 'app-determine-first-player',
  templateUrl: './determine-first-player.component.html',
  styleUrls: ['./determine-first-player.component.scss'],
})
export class DetermineFirstPlayerComponent {
  public readonly diceRolls$ = this.determineFirstPlayerService.diceRolls$;
  public readonly firstPlayerIndex$: Observable<number> =
    this.determineFirstPlayerService.firstPlayerIndex$.pipe(
      tap((t) =>
        console.log(
          `%c🐝 determine-first-player.component.ts[ln:13] tap first player`,
          'color: limegreen',
          t
        )
      )
    );

  public constructor(
    private readonly determineFirstPlayerService: DetermineFirstPlayerService
  ) {}

  public onClickRollDiceButton(): void {
    this.determineFirstPlayerService.currentPlayerRollDice();
  }
}
