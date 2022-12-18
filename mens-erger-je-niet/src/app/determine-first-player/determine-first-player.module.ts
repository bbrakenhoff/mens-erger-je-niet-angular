import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetermineFirstPlayerComponent } from './determine-first-player.component';
import { DetermineFirstPlayerService } from './determine-first-player.service';
import { dice } from 'app/factories/dice.token';
import { players } from 'app/factories/players.token';

@NgModule({
  declarations: [DetermineFirstPlayerComponent],
  exports: [DetermineFirstPlayerComponent],
  providers: [
    { provide: 'Players', useValue: players },
    { provide: 'Dice', useValue: dice },
    { provide: DetermineFirstPlayerService },
  ],
  imports: [CommonModule],
})
export class DetermineFirstPlayerModule {}
