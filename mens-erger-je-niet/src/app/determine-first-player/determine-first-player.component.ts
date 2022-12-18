import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DetermineFirstPlayerService } from './determine-first-player.service';

@Component({
  selector: 'app-determine-first-player',
  templateUrl: './determine-first-player.component.html',
  styleUrls: ['./determine-first-player.component.scss'],
})
export class DetermineFirstPlayerComponent {
  public readonly diceRoll$: Observable<{
    playerIndex: number;
    diceRoll: number;
  }> = this.determineFirstPlayerService.currentPlayerDiceRoll$;
  public readonly firstPlayerIndex$: Observable<number> =
    this.determineFirstPlayerService.firstPlayerIndex$;

  public constructor(
    private readonly determineFirstPlayerService: DetermineFirstPlayerService
  ) {}

  public onRollButtonClick(): void {
    this.determineFirstPlayerService.currentPlayerRollDice();
  }
}
