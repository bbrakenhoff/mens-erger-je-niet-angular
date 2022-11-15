import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PawnColorPipe } from 'app/pawn-color.pipe';
import { Board } from 'models/board';
import { BoardComponent } from './board.component';
import { FieldComponent } from './field/field.component';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoardComponent, FieldComponent, PawnColorPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    component.board = new Board();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have fields that represent the board together', () => {
  //   const fieldComponents = fixture.debugElement.queryAll(By.css('app-field'));
  //   expect(fieldComponents.length).toBe(121);
  // const nonEmptyFieldComponent=  fieldComponents.map((fieldComponent) => fieldComponent.nativeElement as HTMLElement)
  //   .filter((nativeFieldComponent)=>nativeFieldComponent.hasAttribute('[field]'))

    // expect()
  });
});
