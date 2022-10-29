import { Color } from "models/color";
import { Field } from "./field";

export class NormalField extends Field {
  constructor(color: Color) {
    super(color);
  }
}
