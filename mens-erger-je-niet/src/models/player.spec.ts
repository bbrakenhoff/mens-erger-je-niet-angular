import { Dice } from './dice';
import { Player } from './player';

describe('Player', () => {
  let player: Player;

  beforeEach(() => {
    player = new Player([]);
  });

  describe('rollDice(dice)', () => {
    it('should roll the dice and remember number of eyes rolled', () => {
      const dice: Dice = new Dice();
      spyOn(dice, 'roll').and.returnValue(3);
      player.rollDice(dice);
      expect(player.numberOfEyesRolledWithDice).toEqual(3);
    });
  });
});
