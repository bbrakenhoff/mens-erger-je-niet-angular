import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { FieldComponent } from './board/field/field.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, BoardComponent, FieldComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    // spyOn(app.game, 'currentPlayerRollDice');
    // const btnRollDice: HTMLButtonElement = fixture.debugElement.query(
    //   By.css('#btn-rollDice')
    // ).nativeElement;
    // btnRollDice.click();
    // expect(app.game.currentPlayerRollDice).toHaveBeenCalled();
  });
});
