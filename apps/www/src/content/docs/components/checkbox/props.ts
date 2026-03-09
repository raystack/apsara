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

  /**
   * Identifies the checkbox within a `Checkbox.Group`. The group uses this value in its `value` array.
   */
  name?: string;

  /**
   * When true, the checkbox acts as a parent (select all) checkbox within a group.
   * @defaultValue false
   */
  parent?: boolean;

  /** Additional CSS class name. */
  className?: string;
}

export interface CheckboxGroupProps {
  /** The values of checkboxes that should be checked by default (uncontrolled). */
  defaultValue?: string[];

  /** The controlled values of the checked checkboxes. */
  value?: string[];

  /** Event handler called when the checked values change. */
  onValueChange?: (value: string[], event: Event) => void;

  /**
   * All checkbox values in the group. Required when using a parent checkbox.
   */
  allValues?: string[];

  /**
   * When true, prevents user interaction with all checkboxes in the group.
   * @defaultValue false
   */
  disabled?: boolean;

  /** Additional CSS class name. */
  className?: string;
}
