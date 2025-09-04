export interface HeadlineProps {
  /**
   * Controls the size of the headline.
   * @default "t1"
   */
  size?: 't1' | 't2' | 't3' | 't4';

  /**
   * HTML heading element to render.
   * @default "h2"
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  /**
   * Text alignment.
   * @default "left"
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Enable text truncation with ellipsis.
   * @default false
   */
  truncate?: boolean;

  /** Additional CSS class names */
  className?: string;
}
