/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { Dice } from '../../models/dice';
import { Player } from '../../models/player';
import { Turn } from '../../models/turn';
import { DetermineFirstPlayerService } from './determine-first-player.service';

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

fdescribe('DetermineFirstPlayerService', () => {
  let playerSpies: PlayerSpy[];
  let diceSpy: DiceSpy;
  let sut: DetermineFirstPlayerService;

  let testScheduler: TestScheduler;

  beforeEach(() => {
    playerSpies = [
      createPlayerSpy(),
      createPlayerSpy(),
      createPlayerSpy(),
      createPlayerSpy(),
    ];
    diceSpy = createDiceSpy();

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: 'Dice', useValue: diceSpy.dice },
        {
          provide: 'Players',
          useValue: playerSpies.map((playerSpy) => playerSpy.player),
        },
      ],
    });
    sut = TestBed.inject(DetermineFirstPlayerService);
  });

  it('should be created', () => {
    expect(sut).toBeTruthy();
  });

  describe('currentPlayerRollDice()', () => {
    it('should let the players roll the dice', () => {
      sut.currentPlayerRollDice();
      sut.currentPlayerRollDice();
      sut.currentPlayerRollDice();
      sut.currentPlayerRollDice();

      expect(playerSpies[0].endTurn).not.toHaveBeenCalled();
      expect(playerSpies[0].rollDice).toHaveBeenCalledWith(diceSpy.dice);
      expect(playerSpies[0].startTurn).toHaveBeenCalled();

      expect(playerSpies[1].endTurn).toHaveBeenCalled();
      expect(playerSpies[1].rollDice).toHaveBeenCalledWith(diceSpy.dice);
      expect(playerSpies[1].startTurn).toHaveBeenCalled();

      expect(playerSpies[2].endTurn).toHaveBeenCalled();
      expect(playerSpies[2].rollDice).toHaveBeenCalledWith(diceSpy.dice);
      expect(playerSpies[2].startTurn).toHaveBeenCalled();

      expect(playerSpies[3].endTurn).toHaveBeenCalled();
      expect(playerSpies[3].rollDice).toHaveBeenCalledWith(diceSpy.dice);
      expect(playerSpies[3].startTurn).toHaveBeenCalled();

      expect(diceSpy.roll).toHaveBeenCalled();
    });
  });

  describe('firstPlayerIndex$', () => {
    it('should emit -1 when none of the players rolled the dice yet', () => {
      testScheduler.run(({ expectObservable }) => {
        expectObservable(sut.firstPlayerIndex$).toBe('a', {
          a: -1,
        });
      });
    });

    it('should emit -1 when not all players have rolled the dice yet', () => {
      testScheduler.run(({ expectObservable }) => {
        diceSpy.roll.and.returnValues(3, 4, 5);

        const replaySubject$$ = new ReplaySubject<number>();
        sut.firstPlayerIndex$.subscribe(replaySubject$$);

        sut.currentPlayerRollDice();
        sut.currentPlayerRollDice();
        sut.currentPlayerRollDice();

        expectObservable(replaySubject$$).toBe('(a)', {
          a: -1,
        });
      });
    });

    it('should emit -1 when first player not determined and multiple players have the highest dice roll', () => {
      testScheduler.run(({ expectObservable }) => {
        diceSpy.roll.and.returnValues(3, 4, 5, 5);

        const replaySubject$$ = new ReplaySubject<number>();
        sut.firstPlayerIndex$.subscribe(replaySubject$$);

        sut.currentPlayerRollDice();
        sut.currentPlayerRollDice();
        sut.currentPlayerRollDice();
        sut.currentPlayerRollDice();

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
        sut.firstPlayerIndex$.subscribe(replaySubject$$);

        sut.currentPlayerRollDice();
        sut.currentPlayerRollDice();
        sut.currentPlayerRollDice();
        sut.currentPlayerRollDice();

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
        sut.firstPlayerIndex$.subscribe(replaySubject$$);

        sut.currentPlayerRollDice();
        sut.currentPlayerRollDice();
        sut.currentPlayerRollDice();
        sut.currentPlayerRollDice();

        expectObservable(replaySubject$$).toBe('(abc|)', {
          a: -1,
          b: -1,
          c: 2,
          d: -1,
        });
      });
    });
  });

  fdescribe('diceRolls$', () => {
    it('should emit index of first player when first player determined', () => {
      testScheduler.run(({ expectObservable }) => {
        diceSpy.roll.and.returnValues(3, 4, 4, 2, 6,5, 4, 1);

        const replaySubject$$ = new ReplaySubject<
          {
            playerIndex: number;
            diceRoll: number;
          }[]
        >();
        sut.diceRolls$.subscribe(replaySubject$$);

        sut.currentPlayerRollDice();
        sut.currentPlayerRollDice();
        sut.currentPlayerRollDice();
        sut.currentPlayerRollDice();

        // sut.currentPlayerRollDice();
        // sut.currentPlayerRollDice();
        // sut.currentPlayerRollDice();
        // sut.currentPlayerRollDice();

        expectObservable(replaySubject$$).toBe('(abcdef)', {
          a: [
            { playerIndex: 0, diceRoll: -1 },
            { playerIndex: 1, diceRoll: -1 },
            { playerIndex: 2, diceRoll: -1 },
            { playerIndex: 3, diceRoll: -1 },
          ],
          b: [
            { playerIndex: 0, diceRoll: 3 },
            { playerIndex: 1, diceRoll: -1 },
            { playerIndex: 2, diceRoll: -1 },
            { playerIndex: 3, diceRoll: -1 },
          ],
          c: [
            { playerIndex: 0, diceRoll: 3 },
            { playerIndex: 1, diceRoll: 4 },
            { playerIndex: 2, diceRoll: -1 },
            { playerIndex: 3, diceRoll: -1 },
          ],
          d: [
            { playerIndex: 0, diceRoll: 3 },
            { playerIndex: 1, diceRoll: 4 },
            { playerIndex: 2, diceRoll: 4 },
            { playerIndex: 3, diceRoll: -1 },
          ],
          e: [
            { playerIndex: 0, diceRoll: 3 },
            { playerIndex: 1, diceRoll: 4 },
            { playerIndex: 2, diceRoll: 4 },
            { playerIndex: 3, diceRoll: 2 },
          ],
          f: [
            { playerIndex: 0, diceRoll: -1 },
            { playerIndex: 1, diceRoll: -1 },
            { playerIndex: 2, diceRoll: -1 },
            { playerIndex: 3, diceRoll: -1 },
          ],
          g: [
            { playerIndex: 0, diceRoll: 4 },
            { playerIndex: 1, diceRoll: -1 },
            { playerIndex: 2, diceRoll: -1 },
            { playerIndex: 3, diceRoll: -1 },
          ],
          h: [
            { playerIndex: 0, diceRoll: 4 },
            { playerIndex: 1, diceRoll: 3 },
            { playerIndex: 2, diceRoll: -1 },
            { playerIndex: 3, diceRoll: -1 },
          ],
          i: [
            { playerIndex: 0, diceRoll: 4 },
            { playerIndex: 1, diceRoll: 3 },
            { playerIndex: 2, diceRoll: 2 },
            { playerIndex: 3, diceRoll: -1 },
          ],
          j: [
            { playerIndex: 0, diceRoll: 4 },
            { playerIndex: 1, diceRoll: 3 },
            { playerIndex: 2, diceRoll: 2 },
            { playerIndex: 3, diceRoll: 1 },
          ],
        });
      });
    });
  });
});
