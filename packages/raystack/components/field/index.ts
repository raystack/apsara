import { Field as FieldPrimitive } from '@base-ui/react/field';
import {
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel
} from './field-misc';
import { FieldRoot } from './field-root';

export type { FieldLabelProps } from './field-misc';
export type { FieldProps } from './field-root';
export { useFieldContext } from './use-field-context';

export const Field = Object.assign(FieldRoot, {
  Label: FieldLabel,
  Control: FieldControl,
  Error: FieldError,
  Description: FieldDescription,
  Validity: FieldPrimitive.Validity
});
