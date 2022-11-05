import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Game } from 'models/game';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
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

  it('should give turn to next player when button clicked', () => {
    spyOn(app.game, 'nextPlayer');
    const btnNextPlayer: HTMLButtonElement = fixture.debugElement.query(
      By.css('#btn-nextPlayer')
    ).nativeElement;
    btnNextPlayer.click();
    expect(app.game.nextPlayer).toHaveBeenCalled();
  });
});
