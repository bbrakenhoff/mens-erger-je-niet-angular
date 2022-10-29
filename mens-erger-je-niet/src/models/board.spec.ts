import { Board } from './board';
import { HomeField } from './home-field';

fdescribe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  it('should have 4 home fields for each player', () => {
    expect(board.homeFields.length).toBe(4);
    board.homeFields.forEach((homeFieldsForPlayer:HomeField[]) => {
      expect(homeFieldsForPlayer.length).toBe(4)
    })
  });

  it('should have 4 landing fields for each player', () => {
    expect(board.landingFields.length).toBe(4);
    board.landingFields.forEach((landingFieldsForPlayer:HomeField[]) => {
      expect(landingFieldsForPlayer.length).toBe(4)
    })
  });
});
