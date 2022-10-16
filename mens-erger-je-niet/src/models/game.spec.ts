import { allColors, Color } from './color';
import { Game } from './game';
import { Pawn } from './pawn';

describe('Game', () => {
  it('should create 4 players with 4 pawns each', () => {
    const game = new Game();
    expect(game.players.length).toEqual(4);

    expect(game.players[0].pawns.length).toEqual(4);
    expect(
      game.players[0].pawns.every((pawn: Pawn) => pawn.color === Color.Black)
    );
    expect(game.players[1].pawns.length).toEqual(4);
    expect(
      game.players[1].pawns.every((pawn: Pawn) => pawn.color === Color.Green)
    );
    expect(game.players[2].pawns.length).toEqual(4);
    expect(
      game.players[2].pawns.every((pawn: Pawn) => pawn.color === Color.Red)
    );
    expect(game.players[3].pawns.length).toEqual(4);
    expect(
      game.players[3].pawns.every((pawn: Pawn) => pawn.color === Color.Yellow)
    );
  });
});
