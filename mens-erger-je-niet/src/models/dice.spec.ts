import { Dice } from "./dice"

describe('Dice', () => {
    describe('roll()', () => {
        it('should return number between 1 and 6', () => {
            const dice = new Dice();
            expect(dice.roll()).toBeGreaterThanOrEqual(1)
            expect(dice.roll()).toBeLessThanOrEqual(6);
        })

    })
})