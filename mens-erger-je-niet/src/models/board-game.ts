import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { Board } from './board';
import { allColors } from './color';
import { Dice } from './dice';
import { Pawn } from './pawn';
import { Player } from './player';
import { Turn } from './turn';

export class BoardGame {
  private readonly _currentPlayerIndex$$ = new BehaviorSubject(-1);
  public readonly currentPlayerIndex$$ =
    this._currentPlayerIndex$$.asObservable();
  public readonly currentPlayerTurn$ = this.currentPlayerIndex$$.pipe(
    switchMap((currentPlayerIndex) =>
      this.combineCurrentPlayerIndexWithTurn$(currentPlayerIndex)
    )
  );

  public constructor(
    firstPlayerIndex: number,
    public readonly players: readonly Player[] = [
      new Player(),
      new Player(),
      new Player(),
      new Player(),
    ],
    private readonly dice = new Dice(),
    public readonly board = new Board()
  ) {
    this.letPlayersPutPawnsOnHomeFields();
    this.nextTurn(firstPlayerIndex);
  }

  private combineCurrentPlayerIndexWithTurn$(
    currentPlayerIndex: number
  ): Observable<{ playerIndex: number; turn: Turn | undefined }> {
    return combineLatest([
      of(currentPlayerIndex),
      this.currentPlayer.turn$,
    ]).pipe(
      map(([playerIndex, turn]) => ({
        playerIndex,
        turn,
      }))
    );
  }

  private get currentPlayer(): Player {
    return this.players[this._currentPlayerIndex$$.value];
  }

  private letPlayersPutPawnsOnHomeFields(): void {
    const allPawnsInGame: readonly Pawn[][] = BoardGame.createPawns();
    allPawnsInGame.forEach((pawns: Pawn[], i) => {
      const matchingHomeFields = this.board.getFieldGroupByColor(
        pawns[0].color
      ).homeFields;
      this.players[i].pawns.push(...pawns);
      this.players[i].putPawnsOnHomeFields(matchingHomeFields);
    });
  }

  private static createPawns(): readonly Pawn[][] {
    const allPawnsInGame: Pawn[][] = [];
    allColors.forEach((color) => {
      const pawns = [];
      for (let i = 0; i < 4; i++) {
        pawns.push(new Pawn(color));
      }
      allPawnsInGame.push(pawns);
    });

    return allPawnsInGame;
  }

  private nextTurn(playerIndex: number = this.getNextPlayerIndex()): void {
    this._currentPlayerIndex$$.next(playerIndex);
    this.currentPlayer.startTurn();
  }

  private getNextPlayerIndex(): number {
    return 1;
  }

  public currentPlayerRollDice(): void {
    this.currentPlayer.rollDice(this.dice);
  }
}
