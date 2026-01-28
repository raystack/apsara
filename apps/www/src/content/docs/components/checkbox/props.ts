export interface CheckboxProps {
  /**
   * The controlled state of the checkbox
   */
  checked?: boolean;

  /**
   * The default state when initially rendered
   */
  defaultChecked?: boolean;

  /**
   * Event handler called when the state changes
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * When true, the checkbox is in an indeterminate state
   */
  indeterminate?: boolean;

  /**
   * When true, prevents the user from interacting with the checkbox
   */
  disabled?: boolean;
}
