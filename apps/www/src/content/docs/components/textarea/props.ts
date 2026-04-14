export interface TextAreaProps {
  /** Whether the textarea is disabled. */
  disabled?: boolean;

  /** Placeholder text. */
  placeholder?: string;

  /**
   * Custom width for the textarea.
   * @defaultValue "100%"
   */
  width?: string | number;

  /** Controlled value for the textarea. */
  value?: string;

  /** Change handler for controlled usage. */
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;

  /** Additional CSS class names. */
  className?: string;
}
