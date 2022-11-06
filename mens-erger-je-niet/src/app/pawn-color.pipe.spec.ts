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

  it('should return background color with the corresponding color', () => {
    expect(pipe.transform(Color.Blue, 'bg')).toEqual('bg-blue');
    expect(pipe.transform(Color.Green, 'bg')).toEqual('bg-green');
    expect(pipe.transform(Color.Red, 'bg')).toEqual('bg-red');
    expect(pipe.transform(Color.Yellow, 'bg')).toEqual('bg-yellow');
  });

  it('should return foreground color with the corresponding color', () => {
    expect(pipe.transform(Color.Blue, 'fg')).toEqual('fg-blue');
    expect(pipe.transform(Color.Green, 'fg')).toEqual('fg-green');
    expect(pipe.transform(Color.Red, 'fg')).toEqual('fg-red');
    expect(pipe.transform(Color.Yellow, 'fg')).toEqual('fg-yellow');
  });

  it('should return border color with the corresponding color', () => {
    expect(pipe.transform(Color.Blue, 'border')).toEqual('border-blue');
    expect(pipe.transform(Color.Green, 'border')).toEqual('border-green');
    expect(pipe.transform(Color.Red, 'border')).toEqual('border-red');
    expect(pipe.transform(Color.Yellow, 'border')).toEqual('border-yellow');
  });

  it('should return empty string when color is empty', () => {
    expect(pipe.transform(undefined, 'bg')).toBe('');
  });
});
