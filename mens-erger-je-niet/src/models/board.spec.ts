import { Board } from './board';
import { allColors } from './color';

describe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  it('should have 4 home fields for each player', () => {
    expect(board.homeFields.size).toBe(4);
    expect(Array.from(board.homeFields.keys())).toEqual(allColors);
    board.homeFields.forEach((homeFieldsForPlayer, color) => {
      expect(homeFieldsForPlayer.length).toBe(4);
      expect(
        homeFieldsForPlayer.every((homeField) => homeField.color === color)
      ).toBeTrue();
    });
  });

  it('should have 4 landing fields for each player', () => {
    expect(board.landingFields.size).toBe(4);
    expect(Array.from(board.landingFields.keys())).toEqual(allColors);
    board.landingFields.forEach((landingFieldsForPlayer, color) => {
      expect(landingFieldsForPlayer.length).toBe(4);
      expect(
        landingFieldsForPlayer.every(
          (landingField) => landingField.color === color
        )
      ).toBeTrue();
    });
  });
});
