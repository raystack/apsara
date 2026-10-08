export interface SliderProps {
  /** The type of slider. */
  variant?: 'single' | 'range';

  /** Controlled value - number for single, [number, number] for range. */
  value?: number | [number, number];

  /** Initial value - number for single, [number, number] for range. */
  defaultValue?: number | [number, number];

  /**
   * Minimum value.
   * @default 0
   */
  min?: number;

  /**
   * Maximum value.
   * @default 100
   */
  max?: number;

  /**
   * Step increment.
   * @default 1
   */
  step?: number;

  /**
   * Text shown above each thumb and used as its `aria-label`. Pass a tuple to name each thumb of a range.
   */
  thumbLabel?: string | [string, string];

  /**
   * Size of the slider thumb.
   * @default "large"
   */
  thumbSize?: 'small' | 'large';

  /** Callback when value changes. Receives the new value. */
  onValueChange?: (value: number | number[], eventDetails: unknown) => void;

  /** Additional CSS class name. */
  className?: string;

  /** Whether the slider is disabled. */
  disabled?: boolean;

  /** Name attribute for form submission. */
  name?: string;
}

export interface SliderLabelProps {
  /** Additional CSS class name. */
  className?: string;
}

export interface SliderValueProps {
  /** Additional CSS class name. */
  className?: string;
}
