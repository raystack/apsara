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

  /** Callback when input value changes. */
  onChange?: (value: string) => void;

  /** Callback when clear button is clicked. */
  onClear?: () => void;

  /** Additional CSS class names. */
  className?: string;
}
