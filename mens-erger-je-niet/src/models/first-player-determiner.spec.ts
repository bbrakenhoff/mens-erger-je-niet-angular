import { FirstPlayerDeterminer } from './first-player-determiner';
import { Player } from './player';

describe('FirstPlayerDeterminer', () => {
  let players: Player[];
  let firstPlayerDeterminer: FirstPlayerDeterminer;

  const spyOnPlayer = (playerIndex: number, ...diceRolls: number[]) => {
    return spyOnProperty(
      players[playerIndex],
      'latestDiceRoll'
    ).and.returnValues(...diceRolls);
  };

  beforeEach(() => {
    players = [];
    for (let i = 0; i < 4; i++) {
      players.push(new Player([]));
    }
    firstPlayerDeterminer = new FirstPlayerDeterminer();
  });

  describe('isFirstPlayerAlreadyDetermined()', () => {
    it('should return false when first player not yet determined', () => {
      expect(
        firstPlayerDeterminer.isFirstPlayerAlreadyDetermined()
      ).toBeFalse();
    });

    it('should return true when first player determined', () => {
      spyOnPlayer(0, 3);
      spyOnPlayer(1, 4);
      spyOnPlayer(2, 5);
      spyOnPlayer(3, 6);

      expect(
        firstPlayerDeterminer.isFirstPlayerAlreadyDetermined()
      ).toBeFalse();
      firstPlayerDeterminer.determineFirstPlayer(players, 3);
      expect(firstPlayerDeterminer.isFirstPlayerAlreadyDetermined()).toBeTrue();
    });
    it('should return true when first player already determined', () => {
      spyOnPlayer(0, 3, 4);
      spyOnPlayer(1, 4, 3);
      spyOnPlayer(2, 5, 2);
      spyOnPlayer(3, 6, 1);

      expect(
        firstPlayerDeterminer.isFirstPlayerAlreadyDetermined()
      ).toBeFalse();
      firstPlayerDeterminer.determineFirstPlayer(players, 3);
      expect(firstPlayerDeterminer.isFirstPlayerAlreadyDetermined()).toBeTrue();
      expect(firstPlayerDeterminer.isFirstPlayerAlreadyDetermined()).toBeTrue();
    });
  });

  describe('determineFirstPlayer(players, currentPlayerIndex)', () => {
    it('should return -1 when first player not determined and not all players have rolled the dice yet', () => {
      spyOnPlayer(0, 3);
      spyOnPlayer(1, 4);
      spyOnPlayer(2, 5);
      expect(firstPlayerDeterminer.determineFirstPlayer(players, 2)).toBe(-1);
    });

    it('should return false when first player not determined and multiple players have the highest dice roll', () => {
      spyOnPlayer(0, 3);
      spyOnPlayer(1, 4);
      spyOnPlayer(2, 5);
      spyOnPlayer(3, 5);
      expect(firstPlayerDeterminer.determineFirstPlayer(players, 2)).toBe(-1);
    });

    it('should return true when first player not determined yet and all players have rolled the dice and the highest roll of the dice has only been rolled once', () => {
      spyOnPlayer(0, 3, 3);
      spyOnPlayer(1, 4, 4);
      spyOnPlayer(2, 5, 5);
      spyOnPlayer(3, 6, 6);
      expect(firstPlayerDeterminer.determineFirstPlayer(players, 3)).toBe(3);
    });

    it('should return the index of the first player when first player already determined', () => {
      spyOnPlayer(0, 3, 4);
      spyOnPlayer(1, 4, 3);
      spyOnPlayer(2, 5, 2);
      spyOnPlayer(3, 6, 1);

      expect(firstPlayerDeterminer.determineFirstPlayer(players, 3)).toBe(3);
      expect(firstPlayerDeterminer.determineFirstPlayer(players, 3)).toBe(3);
    });
  });
});
