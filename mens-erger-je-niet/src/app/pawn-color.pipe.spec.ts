import { Color } from 'models/color';
import { PawnColorPipe } from './pawn-color.pipe';

describe('PawnColorPipe', () => {
  let pipe: PawnColorPipe;

  beforeEach(() => {
    pipe = new PawnColorPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return color class for the corresponding color', () => {
    expect(pipe.transform(Color.Blue)).toEqual('blue');
    expect(pipe.transform(Color.Green)).toEqual('green');
    expect(pipe.transform(Color.Red)).toEqual('red');
    expect(pipe.transform(Color.Yellow)).toEqual('yellow');
  });

  it('should return empty string when color is empty', () => {
    expect(pipe.transform(undefined)).toBe('');
  });
});
