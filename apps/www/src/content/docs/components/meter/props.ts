export interface MeterProps {
  /** The current value of the meter. */
  value: number;

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
   * The visual style of the meter.
   * @default "linear"
   */
  variant?: 'linear' | 'circular';

  /** Additional CSS class name. */
  className?: string;
}

export interface MeterLabelProps {
  /** The label text content. */
  children: React.ReactNode;

  /** Additional CSS class name. */
  className?: string;
}

export interface MeterValueProps {
  /** Additional CSS class name. */
  className?: string;
}

export interface MeterTrackProps {
  /** Additional CSS class name. */
  className?: string;
}
