import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PawnColorPipe } from 'app/pawn-color.pipe';
import { Color } from 'models/color';
import { Field } from 'models/fields/field';
import { HomeField } from 'models/fields/home-field';
import { NormalField } from 'models/fields/normal-field';
import { Pawn } from 'models/pawn';

import { FieldComponent } from './field.component';

describe('FieldComponent', () => {
  let component: FieldComponent;
  let fixture: ComponentFixture<FieldComponent>;

  let fieldSpy: Field;
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

  describe('change background of field according to color when home field', () => {
    it('should be blue when field is blue', () => {
      fieldSpy = new HomeField(Color.Blue);
      component.field = fieldSpy;
      fixture.detectChanges();

      expect(fieldElement().classes['home-field']).toBeTrue();
      expect(fieldElement().classes['blue']).toBeTrue();
    });

    it('should be blue when field is green', () => {
      fieldSpy = new HomeField(Color.Green);
      component.field = fieldSpy;
      fixture.detectChanges();

      expect(fieldElement().classes['home-field']).toBeTrue();
      expect(fieldElement().classes['green']).toBeTrue();
    });

    it('should be blue when field is red', () => {
      fieldSpy = new HomeField(Color.Red);
      component.field = fieldSpy;
      fixture.detectChanges();

      expect(fieldElement().classes['home-field']).toBeTrue();
      expect(fieldElement().classes['red']).toBeTrue();
    });

    it('should be blue when field is yellow', () => {
      fieldSpy = new HomeField(Color.Yellow);
      component.field = fieldSpy;
      fixture.detectChanges();

      expect(fieldElement().classes['home-field']).toBeTrue();
      expect(fieldElement().classes['yellow']).toBeTrue();
    });
  });

  describe('should change background of field according to color when landing field', () => {
    it('should be blue when field is blue', () => {});
    it('should be blue when field is green', () => {});
    it('should be blue when field is red', () => {});
    it('should be blue when field is yellow', () => {});
  });

  describe('should change border of field according to color when start field', () => {
    it('should be blue when field is blue', () => {});
    it('should be blue when field is green', () => {});
    it('should be blue when field is red', () => {});
    it('should be blue when field is yellow', () => {});
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
