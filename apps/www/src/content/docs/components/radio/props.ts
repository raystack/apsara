export interface RadioRootProps {
  /** The value of the radio item that should be checked by default. */
  defaultValue?: string;

  /** The controlled value of the radio item that is checked. */
  value?: string;

  /** Event handler called when the value changes. */
  onValueChange?: (value: string) => void;

  /** When true, prevents user interaction with the radio group. */
  disabled?: boolean;

  /** The name of the radio group when submitted as a form field. */
  name?: string;

  /** When true, indicates that a value must be selected before the form can be submitted. */
  required?: boolean;

  /** The orientation of the radio group. */
  orientation?: "horizontal" | "vertical";

  /** The reading direction of the radio group. */
  dir?: "ltr" | "rtl";

  /** A label for the radio group that is announced by screen readers. */
  ariaLabel?: string;
}

export interface RadioItemProps {
  /** The unique value of the radio item. */
  value: string;

  /** When true, prevents user interaction with this radio item. */
  disabled?: boolean;

  /** When true, indicates that this radio item must be checked. */
  required?: boolean;

  /** The unique identifier for the radio item. */
  id?: string;
}
