export interface TextAreaProps {
  /**
   * Text label displayed above the textarea.
   */
  label: string;

  /**
   * Boolean indicating if the field is optional.
   * @default false
   */
  isOptional?: boolean;

  /**
   * Helper text displayed below the textarea.
   */
  helperText?: string;

  /**
   * Boolean to show error state.
   */
  error?: boolean;

  /**
   * Custom width for the textarea container.
   * @default "200px"
   */
  width?: string | number;

  /**
   * Controlled value for the textarea.
   */
  value?: string;

  /**
   * Change handler for controlled usage.
   */
  onChange?: (value: string) => void;

  /**
   * Additional CSS class names.
   */
  className?: string;
}
