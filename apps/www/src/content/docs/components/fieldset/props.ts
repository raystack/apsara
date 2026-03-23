export interface FieldsetProps {
  /** Text or node to render as the fieldset legend. */
  legend?: React.ReactNode;

  /**
   * Whether the fieldset and all its child controls are disabled.
   * @defaultValue false
   */
  disabled?: boolean;

  /** Additional CSS class names for the fieldset. */
  className?: string;

  /** Additional CSS class names for the legend (when using `legend` prop). */
  legendClassName?: string;
}

export interface FieldsetLegendProps {
  /** Additional CSS class names. */
  className?: string;
}
