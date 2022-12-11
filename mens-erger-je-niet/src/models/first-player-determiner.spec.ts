import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
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

  let testScheduler: TestScheduler;

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

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('determineFirstPlayer(players, currentPlayerIndex)', () => {
    it('should return -1 when none of the players rolled the dice yet', () => {
      testScheduler.run(({ expectObservable }) => {
        expectObservable(firstPlayerDeterminer.firstPlayerIndex$).toBe('a', {
          a: -1,
        });
      });
    });

    it('should return -1 when not all players have rolled the dice yet', () => {
      testScheduler.run(({ expectObservable }) => {
        const replaySubject$$ = new ReplaySubject<number>();
        firstPlayerDeterminer.firstPlayerIndex$.subscribe(replaySubject$$);

        playerSpies[0].rollDice(3);
        playerSpies[1].rollDice(4);
        playerSpies[2].rollDice(5);

        expectObservable(replaySubject$$).toBe('(a)', {
          a: -1,
        });
      });
    });

    it('should return -1 when first player not determined and multiple players have the highest dice roll', () => {
      testScheduler.run(({ expectObservable }) => {
        const replaySubject$$ = new ReplaySubject<number>();
        firstPlayerDeterminer.firstPlayerIndex$.subscribe(replaySubject$$);

        playerSpies[0].rollDice(3);
        playerSpies[1].rollDice(4);
        playerSpies[2].rollDice(5);
        playerSpies[3].rollDice(5);

        expectObservable(replaySubject$$).toBe('(abc)', {
          a: -1,
          b: -1,
          c: -1,
        });
      });
    });

    it('should return index of first player when first player determined', () => {
      testScheduler.run(({ expectObservable }) => {
        const replaySubject$$ = new ReplaySubject<number>();
        firstPlayerDeterminer.firstPlayerIndex$.subscribe(replaySubject$$);

        playerSpies[0].rollDice(3);
        playerSpies[1].rollDice(4);
        playerSpies[2].rollDice(6);
        playerSpies[3].rollDice(5);

        expectObservable(replaySubject$$).toBe('(abc|)', {
          a: -1,
          b: -1,
          c: 2,
        });
      });
    });

    it('should return the index of the first player when first player already determined', () => {
      testScheduler.run(({ expectObservable }) => {
        const replaySubject$$ = new ReplaySubject<number>();
        firstPlayerDeterminer.firstPlayerIndex$.subscribe(replaySubject$$);

        playerSpies[0].rollDice(3);
        playerSpies[1].rollDice(4);
        playerSpies[2].rollDice(6);
        playerSpies[3].rollDice(5);

        playerSpies[0].rollDice(4);
        playerSpies[1].rollDice(3);
        playerSpies[2].rollDice(2);
        playerSpies[3].rollDice(1);

        expectObservable(replaySubject$$).toBe('(abc|)', {
          a: -1,
          b: -1,
          c: 2,
          d: -1,
        });
      });
    });
  });
});
