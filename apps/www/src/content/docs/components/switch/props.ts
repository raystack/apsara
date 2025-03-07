export interface SwitchProps {
  /** The controlled checked state of the switch. */
  checked?: boolean;

  /** The default checked state when uncontrolled. */
  defaultChecked?: boolean;

  /** Event handler called when the checked state changes. */
  onCheckedChange?: (checked: boolean) => void;

  /** When true, prevents the user from interacting with the switch. */
  disabled?: boolean;

  /** When true, indicates that the user must check the switch. */
  required?: boolean;

  /** A unique identifier for the switch. */
  id?: string;
}
