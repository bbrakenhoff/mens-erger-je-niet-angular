import { Color } from './color';
import { FieldGroup } from './field-group';

describe('FieldGroup', () => {
  const fieldGroup = new FieldGroup(Color.Green);

  describe('constructor(color)', () => {
    it('should have 4 home fields for each color', () => {
      expect(fieldGroup.homeFields.length).toBe(4);
      expect(
        fieldGroup.homeFields.every(
          (homeField) => homeField.color === Color.Green
        )
      ).toBeTrue();
    });

    it('should have home fields connected to start field', () => {
      expect(
        fieldGroup.homeFields.every(
          (homeField) => homeField.next === fieldGroup.startField
        )
      ).toBeTrue();
    });
  });

  it('should have 4 landing fields for each color', () => {
    expect(fieldGroup.landingFields.length).toBe(4);
    expect(
      fieldGroup.landingFields.every(
        (landingField) => landingField.color === Color.Green
      )
    ).toBeTrue();
  });

  it('should have landing fields connected to each other', () => {
    expect(fieldGroup.landingFields[0].next).toBe(fieldGroup.landingFields[1]);
    expect(fieldGroup.landingFields[1].next).toBe(fieldGroup.landingFields[2]);
    expect(fieldGroup.landingFields[1].previous).toBe(
      fieldGroup.landingFields[0]
    );
    expect(fieldGroup.landingFields[2].next).toBe(fieldGroup.landingFields[3]);
    expect(fieldGroup.landingFields[2].previous).toBe(
      fieldGroup.landingFields[1]
    );
    expect(fieldGroup.landingFields[3].next).toBeUndefined();
    expect(fieldGroup.landingFields[3].previous).toBe(
      fieldGroup.landingFields[2]
    );
  });
});
