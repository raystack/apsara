export interface InputProps {
  /**
   * Size variant of the input.
   * @defaultValue "large"
   */
  size?: 'small' | 'large';

  /** Whether the input is disabled. When true, chips are also disabled and their dismiss buttons are hidden. */
  disabled?: boolean;

  /** Icon element to display at the start of input. */
  leadingIcon?: React.ReactNode;

  /** Icon element to display at the end of input. */
  trailingIcon?: React.ReactNode;

  /** Text or symbol to show before input value. */
  prefix?: string;

  /** Text or symbol to show after input value. */
  suffix?: string;

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

  /** Ref to the outer container div. */
  containerRef?: React.RefObject<HTMLDivElement | null>;

  /** The controlled value of the input. */
  value?: string;

  /** Native change handler. Receives the React change event. */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Convenience callback fired with the new string value.
   * Provided by Base UI's Input primitive — use this when you only need the value.
   */
  onValueChange?: (value: string, eventDetails: unknown) => void;

  /** Additional CSS class names. */
  className?: string;
}
