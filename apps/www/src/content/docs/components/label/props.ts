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
   * Text rendered next to the label when `required={true}` and
   * `showRequiredIndicator` is enabled.
   * @defaultValue "(required)"
   */
  requiredText?: string;

  /**
   * When `true` and `required={true}`, renders a `(required)` indicator next
   * to the label. Disabled by default to preserve existing visual layouts.
   * @defaultValue false
   */
  showRequiredIndicator?: boolean;

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
