export interface LabelProps {
  /**
   * Whether the labelled control is required. When `false`, an optional
   * indicator (see `optionalText`) is rendered next to the label.
   */
  required?: boolean;

  /**
   * Text rendered next to the label when `required={false}`.
   * @defaultValue "(optional)"
   */
  optionalText?: string;

  /** Associates the label with a form control using its ID. */
  htmlFor?: string;

  /**
   * A React element to override the default rendered element. Allows polymorphic
   * rendering while preserving label semantics, classes, and ref forwarding.
   */
  render?: React.ReactElement;

  /** Additional CSS class names. */
  className?: string;
}
