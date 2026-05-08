export interface SearchProps {
  /**
   * Size variant of the search input.
   * @default large
   */
  size?: 'small' | 'large';

  /** Placeholder text for the input. */
  placeholder?: string;

  /** Whether the search input is disabled. */
  disabled?: boolean;

  /** Shows a clear button when the input has a value. */
  showClearButton?: boolean;

  /** The controlled value of the input. */
  value?: string;

  /** Native change handler. Receives the React change event. */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Convenience callback fired with the new string value.
   * Forwarded to the underlying Input — use this when you only need the value.
   */
  onValueChange?: (value: string, eventDetails: unknown) => void;

  /** Callback when clear button is clicked. */
  onClear?: () => void;

  /** Additional CSS class names. */
  className?: string;
}
