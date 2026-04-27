export interface FloatingActionsProps {
  /**
   * Visual layout. `floating` pins the bar to the viewport via
   * `position: fixed`; `inline` renders in normal document flow.
   * @defaultValue "floating"
   */
  variant?: 'inline' | 'floating';

  /**
   * Vertical edge to anchor to. Only applies when `variant="floating"`.
   * @defaultValue "bottom"
   */
  side?: 'top' | 'bottom';

  /**
   * Horizontal alignment along the chosen side. Only applies when
   * `variant="floating"`.
   * @defaultValue "center"
   */
  align?: 'start' | 'center' | 'end';

  /** Additional CSS class names. */
  className?: string;

  /** The contents of the floating bar. */
  children?: React.ReactNode;
}

export interface FloatingActionsGroupProps {
  /** Additional CSS class names. */
  className?: string;

  /** The contents of the group. */
  children?: React.ReactNode;
}

export interface FloatingActionsSeparatorProps {
  /**
   * Color variant inherited from the underlying `Separator`.
   * @defaultValue "primary"
   */
  color?: 'primary' | 'secondary' | 'tertiary';

  /**
   * Size variant inherited from the underlying `Separator`.
   * @defaultValue "full"
   */
  size?: 'small' | 'half' | 'full';

  /** Additional CSS class names. */
  className?: string;

  /**
   * Render as a different element or component. Forwarded to Base UI's
   * `Separator` primitive.
   */
  render?:
    | React.ReactElement
    | ((props: React.HTMLAttributes<HTMLDivElement>) => React.ReactNode);
}
