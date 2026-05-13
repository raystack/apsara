export interface SpinnerProps {
  /**
   * Size of the spinner.
   * @default 1
   */
  size?: 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Color variant of the spinner.
   * @default "default"
   *  */
  color?: 'default' | 'neutral' | 'accent' | 'danger' | 'success' | 'attention';

  /** Additional CSS class names. */
  className?: string;

  /**
   * Accessible label announced to screen readers. Ignored when
   * `aria-hidden="true"` is passed.
   * @default "Loading"
   */
  ariaLabel?: string;
}
