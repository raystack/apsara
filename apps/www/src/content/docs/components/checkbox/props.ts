export interface CheckboxProps {
  /**
   * The controlled state of the checkbox
   */
  checked?: boolean | 'indeterminate';

  /**
   * The default state when initially rendered
   */
  defaultChecked?: boolean | 'indeterminate';

  /**
   * Event handler called when the state changes
   */
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;

  /**
   * When true, prevents the user from interacting with the checkbox
   */
  disabled?: boolean;
}
