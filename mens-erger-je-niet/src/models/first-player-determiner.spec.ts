import { BehaviorSubject, count, skip } from 'rxjs';
import { FirstPlayerDeterminer } from './first-player-determiner';
import { Player } from './player';
import { Turn } from './turn';

describe('FirstPlayerDeterminer', () => {
  let playerSpies: {
    player: Player;
    turn$$: BehaviorSubject<Turn | undefined>;
  }[];
  let firstPlayerDeterminer: FirstPlayerDeterminer;

  const createPlayerSpy = (): {
    player: jasmine.SpyObj<Player>;
    turn$$: BehaviorSubject<Turn | undefined>;
  } => {
    const turn$$ = new BehaviorSubject<Turn | undefined>(undefined);

    return {
      player: jasmine.createSpyObj<Player>('Player', [], { turn$: turn$$ }),
      turn$$,
    };
  };

  const playerSpyRollDice = (
    playerSpyIndex: number,
    diceRoll: number
  ): void => {
    playerSpies[playerSpyIndex].turn$$.next({
      diceRoll: -1,
      isPlayerPuttingPawnOnStartField: false,
    });
    playerSpies[playerSpyIndex].turn$$.next({
      diceRoll,
      isPlayerPuttingPawnOnStartField: false,
    });

    playerSpies[playerSpyIndex].turn$$.next(undefined);
  };

  beforeEach(() => {
    playerSpies = [];
    for (let i = 0; i < 4; i++) {
      playerSpies.push(createPlayerSpy());
    }
    firstPlayerDeterminer = new FirstPlayerDeterminer(
      playerSpies.map((spy) => spy.player)
    );
  });

  describe('determineFirstPlayer(players, currentPlayerIndex)', () => {
    it('should return -1 when none of the players rolled the dice yet', (done: DoneFn) => {
      firstPlayerDeterminer.firstPlayerIndex$.subscribe({
        next: (value) => {
          expect(value).toBe(-1);
          done();
        },
        error: done.fail,
      });
    });

    it('should return undefined when first player not determined and not all players have rolled the dice yet', (done: DoneFn) => {
      firstPlayerDeterminer.firstPlayerIndex$.pipe(skip(9)).subscribe({
        next: (value) => {
          expect(value).toBe(-1);
          done();
        },
        error: done.fail,
      });
      playerSpyRollDice(0, 3);
      playerSpyRollDice(1, 4);
      playerSpyRollDice(2, 5);
    });

    it('should return undefined when first player not determined and multiple players have the highest dice roll', (done: DoneFn) => {
      firstPlayerDeterminer.firstPlayerIndex$.pipe(skip(9)).subscribe({
        next: (value) => {
          expect(value).toBe(-1);
          done();
        },
        error: done.fail,
      });
      playerSpyRollDice(0, 3);
      playerSpyRollDice(1, 4);
      playerSpyRollDice(2, 5);
      playerSpyRollDice(3, 5);
    });

    it('should return index of first player when first player determined', (done: DoneFn) => {
      firstPlayerDeterminer.firstPlayerIndex$.pipe(skip(8)).subscribe({
        next: (value) => {
          console.log(
            `Bijoya first-player-determiner.spec.ts[ln:120] in de next`
          );
          expect(value).toBe(3);
        },
        complete: done,
        error: done.fail,
      });

      playerSpyRollDice(0, 3);
      playerSpyRollDice(1, 4);
      playerSpyRollDice(2, 5);
      playerSpyRollDice(3, 6);
    });

    it('should return the index of the first player when first player already determined', (done: DoneFn) => {
      firstPlayerDeterminer.firstPlayerIndex$.pipe(count()).subscribe({
        next: (count) => {
          expect(count).toBe(9);
        },
        complete: done,
        error: done.fail,
      });

      playerSpyRollDice(0, 3);
      playerSpyRollDice(1, 4);
      playerSpyRollDice(2, 5);
      playerSpyRollDice(3, 6);

      playerSpyRollDice(0, 4);
      playerSpyRollDice(1, 3);
      playerSpyRollDice(2, 2);
      playerSpyRollDice(3, 1);
    });
  });
});
