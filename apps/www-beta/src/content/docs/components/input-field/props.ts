export interface InputFieldProps {
  /**
   * Size variant of the input field
   * @default "large"
   */
  size?: 'small' | 'large';

  /** Text label above the input */
  label?: string;

  /** Helper text below the input */
  helperText?: string;

  /** Error message to display below the input */
  error?: string;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Icon element to display at the start of input */
  leadingIcon?: React.ReactNode;

  /** Icon element to display at the end of input */
  trailingIcon?: React.ReactNode;

  /** Shows "(Optional)" text next to label */
  optional?: boolean;

  /** Text or symbol to show before input value */
  prefix?: string;

  /** Text or symbol to show after input value */
  suffix?: string;

  /** Custom width for the input field */
  width?: string | number;

  /**
   * Array of chip objects with label and onRemove function
   * Each chip should have a `label` and an `onRemove` callback.
   */
  chips?: { label: string; onRemove: () => void }[];

  /** Additional CSS class names */
  className?: string;
}
