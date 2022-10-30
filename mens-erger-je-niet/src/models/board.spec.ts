import { Board } from './board';
import { allColors, Color } from './color';

fdescribe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  describe('constructor()', () => {
    it('should have 4 home fields for each color', () => {
      expect(board.homeFields.size).toBe(4);
      expect(Array.from(board.homeFields.keys())).toEqual(allColors);
      board.homeFields.forEach((homeFieldsForPlayer, color) => {
        expect(homeFieldsForPlayer.length).toBe(4);
        expect(
          homeFieldsForPlayer.every((homeField) => homeField.color === color)
        ).toBeTrue();
      });
    });

    it('should have home fields connected to start field', () => {
      board.homeFields.forEach((homeFieldsForPlayer, color) => {
        expect(
          homeFieldsForPlayer.every(
            (homeField) => homeField.next === board.startFields.get(color)
          )
        ).toBeTrue();
      });
    });

    it('should have 4 landing fields for each color', () => {
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

    it('should have landing fields connected to each other', () => {
      board.landingFields.forEach((landingFieldsForPlayer) => {
        expect(landingFieldsForPlayer[0].next).toBe(landingFieldsForPlayer[1]);
        expect(landingFieldsForPlayer[1].next).toBe(landingFieldsForPlayer[2]);
        expect(landingFieldsForPlayer[1].previous).toBe(
          landingFieldsForPlayer[0]
        );
        expect(landingFieldsForPlayer[2].next).toBe(landingFieldsForPlayer[3]);
        expect(landingFieldsForPlayer[2].previous).toBe(
          landingFieldsForPlayer[1]
        );
        expect(landingFieldsForPlayer[3].next).toBeUndefined();
        expect(landingFieldsForPlayer[3].previous).toBe(
          landingFieldsForPlayer[2]
        );
      });
    });

    it('should have landing fields connected to normal fields so that pawns can land', () => {
      expect(board.landingFields.get(Color.Black)![0].previous).toBe(
        board.normalFields.get(Color.Black)![0]
      );
      expect(board.normalFields.get(Color.Black)![0].landingField).toBe(
        board.landingFields.get(Color.Black)![0]
      );

      expect(board.landingFields.get(Color.Green)![0].previous).toBe(
        board.normalFields.get(Color.Green)![0]
      );
      expect(board.normalFields.get(Color.Green)![0].landingField).toBe(
        board.landingFields.get(Color.Green)![0]
      );

      expect(board.landingFields.get(Color.Red)![0].previous).toBe(
        board.normalFields.get(Color.Red)![0]
      );
      expect(board.normalFields.get(Color.Red)![0].landingField).toBe(
        board.landingFields.get(Color.Red)![0]
      );

      expect(board.landingFields.get(Color.Yellow)![0].previous).toBe(
        board.normalFields.get(Color.Yellow)![0]
      );
      expect(board.normalFields.get(Color.Yellow)![0].landingField).toBe(
        board.landingFields.get(Color.Yellow)![0]
      );
    });

    describe('should have start fields connected to normal fields so that pawns can move around the board', () => {
      it('should have black start field connected to green field sets', () => {
        expect(board.startFields.get(Color.Black)!.next).toBe(
          board.normalFields.get(Color.Black)![0]
        );
        expect(board.normalFields.get(Color.Black)![0].previous).toBe(
          board.startFields.get(Color.Black)!
        );
        expect(board.startFields.get(Color.Black)!.previous).toBe(
          board.normalFields.get(Color.Green)![6]
        );
        expect(board.normalFields.get(Color.Green)![6].next).toBe(
          board.startFields.get(Color.Black)!
        );
      });

      it('should have green start field connected to red field sets', () => {
        expect(board.startFields.get(Color.Green)!.next).toBe(
          board.normalFields.get(Color.Green)![0]
        );
        expect(board.normalFields.get(Color.Green)![0].previous).toBe(
          board.startFields.get(Color.Green)!
        );
        expect(board.startFields.get(Color.Green)!.previous).toBe(
          board.normalFields.get(Color.Red)![6]
        );
        expect(board.normalFields.get(Color.Red)![6].next).toBe(
          board.startFields.get(Color.Green)!
        );
      });

      it('should have red start field connected to yellow field sets', () => {
        expect(board.startFields.get(Color.Red)!.next).toBe(
          board.normalFields.get(Color.Red)![0]
        );
        expect(board.normalFields.get(Color.Red)![0].previous).toBe(
          board.startFields.get(Color.Red)!
        );
        expect(board.startFields.get(Color.Red)!.previous).toBe(
          board.normalFields.get(Color.Yellow)![6]
        );
        expect(board.normalFields.get(Color.Yellow)![6].next).toBe(
          board.startFields.get(Color.Red)!
        );
      });

      it('should have yellow start field connected to black field sets', () => {
        expect(board.startFields.get(Color.Yellow)!.next).toBe(
          board.normalFields.get(Color.Yellow)![0]
        );
        expect(board.normalFields.get(Color.Yellow)![0].previous).toBe(
          board.startFields.get(Color.Yellow)!
        );
        expect(board.startFields.get(Color.Yellow)!.previous).toBe(
          board.normalFields.get(Color.Black)![6]
        );
        expect(board.normalFields.get(Color.Black)![6].next).toBe(
          board.startFields.get(Color.Yellow)!
        );
      });
    });

    it('should have connected normal fields', () => {
      board.normalFields.forEach((normalFieldsForPlayer) => {
        expect(normalFieldsForPlayer[0].next).toBe(normalFieldsForPlayer[1]);
        expect(normalFieldsForPlayer[1].next).toBe(normalFieldsForPlayer[2]);
        expect(normalFieldsForPlayer[1].previous).toBe(
          normalFieldsForPlayer[0]
        );
        expect(normalFieldsForPlayer[2].next).toBe(normalFieldsForPlayer[3]);
        expect(normalFieldsForPlayer[2].previous).toBe(
          normalFieldsForPlayer[1]
        );
        expect(normalFieldsForPlayer[3].next).toBe(normalFieldsForPlayer[4]);
        expect(normalFieldsForPlayer[3].previous).toBe(
          normalFieldsForPlayer[2]
        );
        expect(normalFieldsForPlayer[4].next).toBe(normalFieldsForPlayer[5]);
        expect(normalFieldsForPlayer[4].previous).toBe(
          normalFieldsForPlayer[3]
        );
        expect(normalFieldsForPlayer[5].next).toBe(normalFieldsForPlayer[6]);
        expect(normalFieldsForPlayer[5].previous).toBe(
          normalFieldsForPlayer[4]
        );
        expect(normalFieldsForPlayer[6].previous).toBe(
          normalFieldsForPlayer[5]
        );
      });
    });
  });
});
