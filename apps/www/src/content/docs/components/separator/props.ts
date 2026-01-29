export interface SeparatorProps {
  /** Defines the length of the separator.
   * @default "full"
   */
  size?: 'small' | 'half' | 'full';

  /** Sets the color of the separator.
   * @default "primary"
   */
  color?: 'primary' | 'secondary' | 'tertiary';

  /** Sets the direction of the separator.
   * @default "horizontal"
   */
  orientation?: 'horizontal' | 'vertical';

  /** Additional CSS class names. */
  className?: string;

  /**
   * Allows you to replace the component's HTML element with a different tag, or compose it with another component.
   * Accepts a `ReactElement` or a function that returns the element to render.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement
    | ((
        props: React.HTMLAttributes<HTMLElement>,
        state: { orientation: 'horizontal' | 'vertical' }
      ) => React.ReactElement);
}
