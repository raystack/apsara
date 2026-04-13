export interface FieldProps {
  /** Text or node to render as the field label. */
  label?: React.ReactNode;

  /** Description text displayed below the control. Hidden when error is present. */
  description?: React.ReactNode;

  /** Error message displayed below the control. Sets the field to invalid state. */
  error?: React.ReactNode;

  /**
   * Whether the field is required. When false, shows an (optional) indicator next to the label.
   * Also sets the required attribute on child form controls via context.
   * @defaultValue true
   */
  required?: boolean;

  /** Identifies the field during form submission. */
  name?: string;

  /** Custom validation function. Return an error string or null. */
  validate?: (
    value: unknown
  ) => string | string[] | null | Promise<string | string[] | null>;

  /**
   * When to validate the field.
   * @defaultValue "onSubmit"
   */
  validationMode?: 'onSubmit' | 'onBlur' | 'onChange';

  /**
   * Whether the field is in an invalid state.
   * @defaultValue false
   */
  invalid?: boolean;

  /**
   * Whether the field is disabled.
   * @defaultValue false
   */
  disabled?: boolean;

  /** Additional CSS class names. */
  className?: string;
}

export interface FieldLabelProps {
  /**
   * Whether the field is required. When false, shows an (optional) indicator next to the label.
   * @defaultValue true
   */
  required?: boolean;

  /** Additional CSS class names. */
  className?: string;
}

export interface FieldControlProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface FieldErrorProps {
  /**
   * Match a specific ValidityState property (e.g., "valueMissing", "typeMismatch", "customError")
   * or pass `true` to match any error.
   */
  match?: string | boolean;

  /** Additional CSS class names. */
  className?: string;
}

export interface FieldDescriptionProps {
  /** Additional CSS class names. */
  className?: string;
}
