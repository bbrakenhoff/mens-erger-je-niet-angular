import { Board } from './board';
import { allColors, Color } from './color';

describe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  it('should create a field chain for each color', () => {
    expect(board.fieldGroups.map((fieldGroup) => fieldGroup.color)).toEqual(
      allColors
    );
  });

  describe('should have start fields connected to normal fields so that pawns can move around the board', () => {
    it('should have start field connected to latest normal field of next color', () => {
      expect(board.fieldGroups[0].startField.previous).toBe(
        board.fieldGroups[1].normalFields[8]
      );
      expect(board.fieldGroups[1].normalFields[8].next).toBe(
        board.fieldGroups[0].startField
      );

      expect(board.fieldGroups[1].startField.previous).toBe(
        board.fieldGroups[2].normalFields[8]
      );
      expect(board.fieldGroups[2].normalFields[8].next).toBe(
        board.fieldGroups[1].startField
      );

      expect(board.fieldGroups[2].startField.previous).toBe(
        board.fieldGroups[3].normalFields[8]
      );
      expect(board.fieldGroups[3].normalFields[8].next).toBe(
        board.fieldGroups[2].startField
      );

      expect(board.fieldGroups[3].startField.previous).toBe(
        board.fieldGroups[0].normalFields[8]
      );
      expect(board.fieldGroups[0].normalFields[8].next).toBe(
        board.fieldGroups[3].startField
      );
    });
  });

  describe('getFieldGroupByColor(color)', () => {
    it('should return field group by color', () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const redFieldGroup = board.fieldGroups.find(
        (fieldGroup) => fieldGroup.color === Color.Red
      )!;
      expect(board.getFieldGroupByColor(Color.Red)).toBe(redFieldGroup);
    });
  });
});
