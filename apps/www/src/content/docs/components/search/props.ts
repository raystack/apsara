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

  /**
   * Icon before the input. Pass `null` to hide it.
   * @default <SearchIcon />
   */
  leadingIcon?: React.ReactNode;

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

  /**
   * Called when the clear button is clicked or Escape clears the input. Receives the triggering event.
   */
  onClear?: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void;

  /**
   * Native input type. The default gives the input the `searchbox` role.
   * @default "search"
   */
  type?: string;

  /** Additional CSS class names. */
  className?: string;
}
