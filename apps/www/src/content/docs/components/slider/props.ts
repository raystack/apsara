export interface SliderProps {
  /** The type of slider. */
  variant?: "single" | "range";

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
   * Label text to display above thumb(s).
   * For range slider, can be a string or [string, string] for individual thumb labels.
   */
  label?: string | [string, string];

  /** Callback when value changes. */
  onChange?: (value: number | [number, number]) => void;

  /** Additional CSS class name. */
  className?: string;
}
