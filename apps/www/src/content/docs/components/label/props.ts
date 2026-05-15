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

  /**
   * Text rendered next to the label when `required={true}`. No indicator is
   * rendered if this is omitted — preserving apsara's existing behaviour of
   * not surfacing a required marker by default. Pass any non-empty string
   * (e.g. `"(required)"`, `"*"`) to opt in.
   */
  requiredText?: string;

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
