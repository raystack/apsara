export interface HeadlineProps {
  /**
   * Controls the size of the headline.
   * @default "t1"
   */
  size?: 't1' | 't2' | 't3' | 't4';

  /**
   * The headline weight.
   * @default "medium"
   */
  weight?: 'regular' | 'medium';

  /**
   * Custom render element or function. Accepts a JSX element (e.g. `<h1 />`)
   * or a render function for full control.
   * @default "h2"
   */
  render?:
    | React.ReactElement
    | ((props: React.ComponentPropsWithRef<'h2'>) => React.ReactElement);

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
