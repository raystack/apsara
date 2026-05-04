export interface LabelProps {
  /**
   * Whether the labelled control is required. When `false`, an `(optional)`
   * indicator is rendered next to the label.
   */
  required?: boolean;

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
