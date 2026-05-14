export interface OTPFieldProps {
  /**
   * The number of OTP input slots.
   */
  length: number;

  /** The OTP value (controlled). */
  value?: string;

  /** The initial uncontrolled OTP value. */
  defaultValue?: string;

  /**
   * The type of input validation to apply to the OTP value.
   * @defaultValue "numeric"
   */
  validationType?: 'numeric' | 'alpha' | 'alphanumeric' | 'none';

  /**
   * Whether the slot inputs should mask entered characters.
   * @defaultValue false
   */
  mask?: boolean;

  /**
   * Whether to submit the owning form when the OTP becomes complete.
   * @defaultValue false
   */
  autoSubmit?: boolean;

  /**
   * Custom sanitization function. Runs before updating the value when
   * `validationType` is `"none"`.
   */
  sanitizeValue?: (value: string) => string;

  /**
   * The virtual keyboard hint applied to slot inputs.
   */
  inputMode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search';

  /**
   * The input autocomplete attribute applied to the first slot and hidden validation input.
   * @defaultValue "one-time-code"
   */
  autoComplete?: string;

  /**
   * The id of the first input. Subsequent inputs derive ids as `{id}-2`, `{id}-3`, etc.
   */
  id?: string;

  /** Identifies the field when a form is submitted. */
  name?: string;

  /** Associates the field with a form by its `id`. */
  form?: string;

  /**
   * Whether the field is disabled.
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Whether the user is unable to change the field value.
   * @defaultValue false
   */
  readOnly?: boolean;

  /**
   * Whether the user must enter a value before submitting the form.
   * @defaultValue false
   */
  required?: boolean;

  /** Callback fired when the OTP value changes. */
  onValueChange?: (value: string, eventDetails: unknown) => void;

  /**
   * Callback fired when entered text contains characters rejected by sanitization,
   * before the OTP value updates.
   */
  onValueInvalid?: (value: string, eventDetails: unknown) => void;

  /** Callback fired when all slots are filled. */
  onValueComplete?: (value: string, eventDetails: unknown) => void;

  /** Additional CSS class names. */
  className?: string;
}

export interface OTPFieldInputProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface OTPFieldSeparatorProps {
  /** Additional CSS class names. */
  className?: string;
}
