export interface InputFieldProps {
  /**
   * Size variant of the input field.
   * @defaultValue "large"
   */
  size?: 'small' | 'large';

  /** Whether the input is disabled. */
  disabled?: boolean;

  /** Icon element to display at the start of input. */
  leadingIcon?: React.ReactNode;

  /** Icon element to display at the end of input. */
  trailingIcon?: React.ReactNode;

  /** Text or symbol to show before input value. */
  prefix?: string;

  /** Text or symbol to show after input value. */
  suffix?: string;

  /** Custom width for the input field. */
  width?: string | number;

  /**
   * Array of chip objects with label and optional onRemove function.
   */
  chips?: { label: string; onRemove?: () => void }[];

  /**
   * Maximum number of chips to show before displaying overflow count.
   * @defaultValue 2
   */
  maxChipsVisible?: number;

  /**
   * Visual variant of the input.
   * @defaultValue "default"
   */
  variant?: 'default' | 'borderless';

  /** Additional CSS class names. */
  className?: string;
}
