export interface FieldsetProps {
  /** Text to render as the fieldset legend. */
  legend?: string;

  /**
   * Whether the fieldset and all its child controls are disabled.
   * @defaultValue false
   */
  disabled?: boolean;

  /** Additional CSS class names for the fieldset. */
  className?: string;
}

export interface FieldsetLegendProps {
  /** Additional CSS class names. */
  className?: string;
}
