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
   * When true, prevents the user from interacting with the checkbox.
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * When true, the checkbox is displayed in a read-only state.
   * The user cannot change the value but it is still focusable.
   * @defaultValue false
   */
  readOnly?: boolean;

  /**
   * When true, the user must tick the checkbox before submitting a form.
   * @defaultValue false
   */
  required?: boolean;

  /**
   * Identifies the checkbox within a `Checkbox.Group`. The group uses this value in its `value` array.
   */
  name?: string;

  /**
   * When true, the checkbox acts as a parent (select all) checkbox within a group.
   * @defaultValue false
   */
  parent?: boolean;

  /**
   * The size of the checkbox.
   * @defaultValue 'large'
   */
  size?: 'small' | 'large';

  /**
   * Custom render function for the indicator. Receives `(props, state)` where state includes `checked` and `indeterminate`.
   */
  render?: (
    props: React.HTMLAttributes<HTMLSpanElement>,
    state: { checked: boolean; indeterminate: boolean }
  ) => React.ReactNode;

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

  /**
   * Layout direction of the checkbox group.
   * @defaultValue 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';

  /** Additional CSS class name. */
  className?: string;
}
