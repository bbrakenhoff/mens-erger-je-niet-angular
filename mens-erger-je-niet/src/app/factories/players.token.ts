import { InjectionToken } from '@angular/core';
import { Player } from 'models/player';

export const players = new InjectionToken<Player[]>('Players');

export function createPlayers(): Player[] {
  return [new Player(), new Player(), new Player(), new Player()];
}
