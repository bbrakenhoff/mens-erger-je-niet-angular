import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PawnColorPipe } from 'app/pawn-color.pipe';
import { Color } from 'models/color';
import { NormalField } from 'models/fields/normal-field';
import { Pawn } from 'models/pawn';

import { FieldComponent } from './field.component';

describe('FieldComponent', () => {
  let component: FieldComponent;
  let fixture: ComponentFixture<FieldComponent>;

  let fieldSpy: NormalField;
  let pawnSpy: Pawn;

  const pawnElement = (): DebugElement => {
    return fixture.debugElement.query(By.css('#test-pawn'));
  };

  const fieldElement = (): DebugElement => {
    return fixture.debugElement.query(By.css('#test-field'));
  };

  beforeEach(async () => {
    fieldSpy = new NormalField(Color.Yellow, 0);
    pawnSpy = new Pawn(Color.Yellow);

    await TestBed.configureTestingModule({
      declarations: [FieldComponent, PawnColorPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be empty when no field', () => {
    expect(fieldElement()).toBeNull();
    expect(pawnElement()).toBeNull();
  });

  it('should display empty field when no pawn on field', () => {
    component.field = fieldSpy;
    fixture.detectChanges();

    expect(fieldElement()).toBeDefined();
    expect(pawnElement()).toBeNull();
  });

  it('should display pawn on the field', () => {
    fieldSpy.pawn = pawnSpy;
    pawnSpy.field = fieldSpy;
    component.field = fieldSpy;
    fixture.detectChanges();

    expect(fieldElement()).toBeDefined();
    expect(pawnElement()).toBeDefined();
  });

  it('should raise an event when pawn has been clicked', () => {
    fieldSpy.pawn = pawnSpy;
    pawnSpy.field = fieldSpy;
    component.field = fieldSpy;
    fixture.detectChanges();
    spyOn(component.pawnClicked, 'emit').and.callThrough();

    pawnElement().triggerEventHandler('click');

    expect(component.pawnClicked.emit).toHaveBeenCalledWith(pawnSpy);
  });
});
