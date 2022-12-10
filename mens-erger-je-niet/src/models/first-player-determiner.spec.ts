import { BehaviorSubject, count, skip, take } from 'rxjs';
import { FirstPlayerDeterminer } from './first-player-determiner';
import { Player } from './player';
import { Turn } from './turn';

type PlayerSpy = {
  player: Player;
  turn$$: BehaviorSubject<Turn | undefined>;
  rollDice: (diceRoll: number) => void;
};

function createPlayerSpy(): PlayerSpy {
  const turn$$ = new BehaviorSubject<Turn | undefined>(undefined);

  return {
    turn$$,
    player: jasmine.createSpyObj<Player>('Player', [], {
      turn$: turn$$.asObservable(),
    }),
    rollDice: (diceRoll: number): void => {
      turn$$.next({ diceRoll: -1, isPlayerPuttingPawnOnStartField: false });
      turn$$.next({ diceRoll, isPlayerPuttingPawnOnStartField: false });
      turn$$.next(undefined);
    },
  };
}

fdescribe('FirstPlayerDeterminer', () => {
  let playerSpies: PlayerSpy[];
  let firstPlayerDeterminer: FirstPlayerDeterminer;

  beforeEach(() => {
    playerSpies = [
      createPlayerSpy(),
      createPlayerSpy(),
      createPlayerSpy(),
      createPlayerSpy(),
    ];
    firstPlayerDeterminer = new FirstPlayerDeterminer(
      playerSpies.map((spy) => spy.player)
    );
  });

  describe('determineFirstPlayer(players, currentPlayerIndex)', () => {
    fit('should return -1 when none of the players rolled the dice yet', (done: DoneFn) => {
      firstPlayerDeterminer.firstPlayerIndex$.subscribe({
        next: (value: number) => {
          expect(value).toBe(-1);
          done();
        },
        error: done.fail,
      });
    });

    fit('should return -1 when not all players have rolled the dice yet', (done: DoneFn) => {
      firstPlayerDeterminer.firstPlayerIndex$.pipe(take(1)).subscribe({
        next: (value: number) => {
          console.log(`🐝 first-player-determiner.spec.ts[ln:58] test`);
          expect(value).toBe(-1);
          done();
        },
        complete: done.fail,
        error: done.fail,
      });
      playerSpies[0].rollDice(3);
      playerSpies[1].rollDice(4);
      playerSpies[2].rollDice(5);
    });

    it('should return -1 when first player not determined and multiple players have the highest dice roll', (done: DoneFn) => {
      firstPlayerDeterminer.firstPlayerIndex$.pipe(count()).subscribe({
        next: (value: number) => {
          expect(value).toBe(-1);
          done();
        },
        error: done.fail,
      });
      playerSpies[0].rollDice(3);
      playerSpies[1].rollDice(4);
      playerSpies[2].rollDice(5);
      playerSpies[3].rollDice(5);
    });

    it('should return index of first player when first player determined', (done: DoneFn) => {
      firstPlayerDeterminer.firstPlayerIndex$.pipe(skip(7)).subscribe({
        next: (value: number) => {
          expect(value).toBe(2);
          done();
        },
        complete: done,
        error: done.fail,
      });

      playerSpies[0].rollDice(3);
      playerSpies[1].rollDice(4);
      playerSpies[2].rollDice(6);
      playerSpies[3].rollDice(5);
    });

    it('should return the index of the first player when first player already determined', (done: DoneFn) => {
      firstPlayerDeterminer.firstPlayerIndex$.pipe(count()).subscribe({
        next: (count: number) => {
          expect(count).toBe(9);
          done();
        },
        complete: done,
        error: done.fail,
      });

      playerSpies[0].rollDice(3);
      playerSpies[1].rollDice(4);
      playerSpies[2].rollDice(5);
      playerSpies[3].rollDice(6);

      playerSpies[0].rollDice(4);
      playerSpies[1].rollDice(3);
      playerSpies[2].rollDice(2);
      playerSpies[3].rollDice(1);
    });
  });
});
