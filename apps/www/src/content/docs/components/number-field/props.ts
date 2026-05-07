export interface NumberFieldProps {
  /** Controlled numeric value. */
  value?: number | null;

  /**
   * Initial uncontrolled value.
   * @defaultValue 0
   */
  defaultValue?: number;

  /** Event handler called when the value changes. */
  onValueChange?: (value: number | null, event: Event) => void;

  /** Minimum allowed value. */
  min?: number;

  /** Maximum allowed value. */
  max?: number;

  /**
   * Step amount for increment/decrement.
   * @defaultValue 1
   */
  step?: number;

  /**
   * Whether the field is disabled.
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Whether the field is read-only.
   * @defaultValue false
   */
  readOnly?: boolean;

  /**
   * Whether the field is required.
   * @defaultValue false
   */
  required?: boolean;

  /**
   * BCP 47 locale tag (or array). Controls separators, grouping, and currency
   * symbol placement when used with `format`. Defaults to the user's runtime locale,
   * which means rendered output varies by browser. Pass an explicit value when
   * deterministic formatting is required.
   * @defaultValue runtime locale
   */
  locale?: Intl.LocalesArgument;

  /** Number formatting options (Intl.NumberFormatOptions). */
  format?: Intl.NumberFormatOptions;

  /** Additional CSS class names. */
  className?: string;
}

export interface NumberFieldGroupProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface NumberFieldInputProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface NumberFieldDecrementProps {
  /** Custom content for the decrement button. Defaults to a minus icon. */
  children?: React.ReactNode;

  /** Additional CSS class names. */
  className?: string;
}

export interface NumberFieldIncrementProps {
  /** Custom content for the increment button. Defaults to a plus icon. */
  children?: React.ReactNode;

  /** Additional CSS class names. */
  className?: string;
}

export interface NumberFieldScrubAreaProps {
  /** Label text displayed in the scrub area. */
  label: string;

  /**
   * Scrub direction.
   * @defaultValue "horizontal"
   */
  direction?: 'horizontal' | 'vertical';

  /** Additional CSS class names. */
  className?: string;
}
