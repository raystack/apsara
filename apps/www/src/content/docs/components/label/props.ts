export interface LabelProps {
  /**
   * Controls the size of the label.
   * @default "small"
   */
  size?: "small" | "medium" | "large";

  /** When true, shows a required field indicator. */
  required?: boolean;

  /**
   * Customizes the required field indicator.
   * @default "*"
   */
  requiredIndicator?: string;

  /** Associates the label with a form control using its ID. */
  htmlFor?: string;

  /** Additional CSS class names. */
  className?: string;
}
