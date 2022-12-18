import { InjectionToken } from '@angular/core';
import { Dice } from 'models/dice';
import { Player } from 'models/player';

export const players = new InjectionToken<Player[]>('Players', {
  factory: (): Player[] => [
    new Player(),
    new Player(),
    new Player(),
    new Player(),
  ],
});
