import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEventMessageComponent } from './game-event-message.component';

describe('GameEventMessageComponent', () => {
  let component: GameEventMessageComponent;
  let fixture: ComponentFixture<GameEventMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameEventMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEventMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
