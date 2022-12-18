/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { Dice } from './dice';
import { FirstPlayerDeterminer } from './first-player-determiner';
import { Player } from './player';
import { Turn } from './turn';

type PlayerSpy = {
  player: Player;
  turn$$: BehaviorSubject<Turn | undefined>;
  rollDice: jasmine.Spy<(dice: Dice) => void>;
  startTurn: jasmine.Spy<() => void>;
  endTurn: jasmine.Spy<() => void>;
};

function createPlayerSpy(): PlayerSpy {
  const turn$$ = new BehaviorSubject<Turn | undefined>(undefined);
  const player = new Player();
  (player['turn$'] as any) = turn$$;
  const playerSpy: PlayerSpy = {
    player,
    turn$$,
    rollDice: spyOn(player, 'rollDice'),
    startTurn: spyOn(player, 'startTurn'),
    endTurn: spyOn(player, 'endTurn'),
  };

  playerSpy.rollDice.and.callFake((dice) => {
    turn$$.next({
      diceRoll: dice.roll(),
      isPlayerPuttingPawnOnStartField: false,
    });
  });

  playerSpy.startTurn.and.callFake(() =>
    turn$$.next({
      diceRoll: -1,
      isPlayerPuttingPawnOnStartField: false,
    })
  );

  playerSpy.endTurn.and.callFake(() => turn$$.next(undefined));

  return playerSpy;
}

type DiceSpy = {
  dice: Dice;
  roll: jasmine.Spy<() => number>;
};

function createDiceSpy(): DiceSpy {
  const dice = new Dice();
  return { dice, roll: spyOn(dice, 'roll') };
}

fdescribe('FirstPlayerDeterminer', () => {
  let playerSpies: PlayerSpy[];
  let diceSpy: DiceSpy;
  let firstPlayerDeterminer: FirstPlayerDeterminer;

  let testScheduler: TestScheduler;

  beforeEach(() => {
    playerSpies = [
      createPlayerSpy(),
      createPlayerSpy(),
      createPlayerSpy(),
      createPlayerSpy(),
    ];
    diceSpy = createDiceSpy();
    firstPlayerDeterminer = new FirstPlayerDeterminer(
      playerSpies.map((playerSpy) => playerSpy.player),
      diceSpy.dice
    );

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('currentPlayerRollDice()', () => {
    it('should emit -1 when none of the players rolled the dice yet', () => {
      testScheduler.run(({ expectObservable }) => {
        expectObservable(firstPlayerDeterminer.firstPlayerIndex$).toBe('a', {
          a: -1,
        });
      });
    });

    it('should let the current player roll the dice', () => {
      firstPlayerDeterminer.currentPlayerRollDice();
      expect(playerSpies[0].rollDice).toHaveBeenCalledWith(diceSpy.dice);
      expect(diceSpy.roll).toHaveBeenCalled();
    });

    it('should emit -1 when not all players have rolled the dice yet', () => {
      testScheduler.run(({ expectObservable }) => {
        diceSpy.roll.and.returnValues(3, 4, 5);

        const replaySubject$$ = new ReplaySubject<number>();
        firstPlayerDeterminer.firstPlayerIndex$.subscribe(replaySubject$$);

        firstPlayerDeterminer.currentPlayerRollDice();
        firstPlayerDeterminer.currentPlayerRollDice();
        firstPlayerDeterminer.currentPlayerRollDice();

        expect(playerSpies[0].rollDice).toHaveBeenCalledWith(diceSpy.dice);
        expect(playerSpies[1].rollDice).toHaveBeenCalledWith(diceSpy.dice);
        expect(playerSpies[2].rollDice).toHaveBeenCalledWith(diceSpy.dice);

        expectObservable(replaySubject$$).toBe('(a)', {
          a: -1,
        });
      });
    });

    it('should emit -1 when first player not determined and multiple players have the highest dice roll', () => {
      testScheduler.run(({ expectObservable }) => {
        diceSpy.roll.and.returnValues(3, 4, 5, 5);

        const replaySubject$$ = new ReplaySubject<number>();
        firstPlayerDeterminer.firstPlayerIndex$.subscribe(replaySubject$$);

        firstPlayerDeterminer.currentPlayerRollDice();
        firstPlayerDeterminer.currentPlayerRollDice();
        firstPlayerDeterminer.currentPlayerRollDice();
        firstPlayerDeterminer.currentPlayerRollDice();

        expect(playerSpies[0].rollDice).toHaveBeenCalledWith(diceSpy.dice);
        expect(playerSpies[1].rollDice).toHaveBeenCalledWith(diceSpy.dice);
        expect(playerSpies[2].rollDice).toHaveBeenCalledWith(diceSpy.dice);
        expect(playerSpies[3].rollDice).toHaveBeenCalledWith(diceSpy.dice);

        expectObservable(replaySubject$$).toBe('(abc)', {
          a: -1,
          b: -1,
          c: -1,
        });
      });
    });

    it('should emit index of first player when first player determined', () => {
      testScheduler.run(({ expectObservable }) => {
        diceSpy.roll.and.returnValues(3, 4, 6, 5);

        const replaySubject$$ = new ReplaySubject<number>();
        firstPlayerDeterminer.firstPlayerIndex$.subscribe(replaySubject$$);

        firstPlayerDeterminer.currentPlayerRollDice();
        firstPlayerDeterminer.currentPlayerRollDice();
        firstPlayerDeterminer.currentPlayerRollDice();
        firstPlayerDeterminer.currentPlayerRollDice();

        expect(playerSpies[0].rollDice).toHaveBeenCalledWith(diceSpy.dice);
        expect(playerSpies[1].rollDice).toHaveBeenCalledWith(diceSpy.dice);
        expect(playerSpies[2].rollDice).toHaveBeenCalledWith(diceSpy.dice);
        expect(playerSpies[3].rollDice).toHaveBeenCalledWith(diceSpy.dice);

        expect(diceSpy.roll).toHaveBeenCalledTimes(4);

        expectObservable(replaySubject$$).toBe('(abc|)', {
          a: -1,
          b: -1,
          c: 2,
        });
      });
    });

    it('should emit the index of the first player when first player already determined', () => {
      testScheduler.run(({ expectObservable }) => {
        diceSpy.roll.and.returnValues(3, 4, 6, 5, 4, 3, 2, 1);

        const replaySubject$$ = new ReplaySubject<number>();
        firstPlayerDeterminer.firstPlayerIndex$.subscribe(replaySubject$$);

        firstPlayerDeterminer.currentPlayerRollDice();
        firstPlayerDeterminer.currentPlayerRollDice();
        firstPlayerDeterminer.currentPlayerRollDice();
        firstPlayerDeterminer.currentPlayerRollDice();

        expect(playerSpies[0].rollDice).toHaveBeenCalledWith(diceSpy.dice);
        expect(playerSpies[1].rollDice).toHaveBeenCalledWith(diceSpy.dice);
        expect(playerSpies[2].rollDice).toHaveBeenCalledWith(diceSpy.dice);
        expect(playerSpies[3].rollDice).toHaveBeenCalledWith(diceSpy.dice);

       

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
