import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Game } from 'models/game';
import { AppComponent } from './app.component';
import { PawnColorPipe } from './pawn-color.pipe';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, PawnColorPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should roll dice when button clicked', () => {
    spyOn(app.game, 'currentPlayerRollDice');
    const btnRollDice: HTMLButtonElement = fixture.debugElement.query(
      By.css('#btn-rollDice')
    ).nativeElement;
    btnRollDice.click();
    expect(app.game.currentPlayerRollDice).toHaveBeenCalled();
  });
});
