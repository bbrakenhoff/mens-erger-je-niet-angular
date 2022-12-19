import { InjectionToken } from '@angular/core';
import { Dice } from 'models/dice';

export const dice = new InjectionToken<Dice>('Dice');

export function createDice(): Dice {
  return new Dice();
}
