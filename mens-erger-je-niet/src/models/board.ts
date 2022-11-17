import { allColors, Color } from './color';
import { FieldGroup } from './field-group';

export class Board {
  private _fieldGroup = Board.createFieldGroupsForEachColor();
  public get fieldGroups(): ReadonlyArray<FieldGroup> {
    return this._fieldGroup;
  }

  public constructor() {
    this.connectStartFieldToNormalFields();
  }

  private static createFieldGroupsForEachColor(): ReadonlyArray<FieldGroup> {
    return allColors.map((color) => new FieldGroup(color));
  }

  private connectStartFieldToNormalFields(): void {
    this._fieldGroup.forEach((fieldGroup: FieldGroup, i) => {
      const nextIndex = i < 3 ? i + 1 : 0;
      const normalFieldNextColor = this._fieldGroup[nextIndex].normalFields[8];
      fieldGroup.startField.previous = normalFieldNextColor;
      normalFieldNextColor.next = fieldGroup.startField;
    });
  }

  public getFieldGroupByColor(color: Color): FieldGroup {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.fieldGroups.find((fieldGroup) => fieldGroup.color === color)!;
  }
}
