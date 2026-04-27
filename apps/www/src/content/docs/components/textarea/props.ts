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
   * Custom width for the textarea.
   * @defaultValue "100%"
   */
  width?: string | number;

  /**
   * Number of visible text rows.
   * @defaultValue 3
   */
  rows?: number;

  /** Controlled value for the textarea. */
  value?: string;

  /** Change handler for controlled usage. */
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;

  /** Additional CSS class names. */
  className?: string;
}
