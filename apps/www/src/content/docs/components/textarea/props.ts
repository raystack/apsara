export interface TextAreaProps {
  /**
   * Size variant of the textarea.
   * @defaultValue "large"
   */
  size?: 'small' | 'large';

  /**
   * Visual variant of the textarea.
   * @defaultValue "default"
   */
  variant?: 'default' | 'borderless';

  /** Whether the textarea is disabled. */
  disabled?: boolean;

  /** Placeholder text. */
  placeholder?: string;

  /**
   * Number of visible text rows.
   * @defaultValue 3
   */
  rows?: number;

  /** Controlled value for the textarea. */
  value?: string;

  /** Change handler for controlled usage. Receives the React change event. */
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;

  /**
   * Convenience callback fired alongside `onChange` with the new string value.
   * `eventDetails.event` is the native input event.
   */
  onValueChange?: (
    value: string,
    eventDetails: { reason: 'none'; event: Event }
  ) => void;

  /** Additional CSS class names. */
  className?: string;

  /**
   * Corner radius for this text area only. Overrides the theme's `radius`.
   * @defaultValue The theme's `radius`
   */
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}
