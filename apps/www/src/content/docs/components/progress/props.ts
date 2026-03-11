export interface ProgressProps {
  /**
   * The current value. Set to `null` for indeterminate state.
   * @default 0
   */
  value?: number | null;

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
   * The visual style of the progress.
   * @default "linear"
   */
  variant?: 'linear' | 'circular';

  /** Additional CSS class name. */
  className?: string;
}

export interface ProgressLabelProps {
  /** The label text content. */
  children: React.ReactNode;

  /** Additional CSS class name. */
  className?: string;
}

export interface ProgressValueProps {
  /** Additional CSS class name. */
  className?: string;
}

export interface ProgressTrackProps {
  /** Additional CSS class name. */
  className?: string;
}
