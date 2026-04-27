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

  /**
   * The ARIA role of the container.
   * @defaultValue "toolbar"
   */
  role?: string;

  /** Additional CSS class names. */
  className?: string;

  /** The contents of the floating bar. */
  children?: React.ReactNode;
}

export interface FloatingActionsSeparatorProps {
  /**
   * Color variant inherited from the underlying `Separator`.
   * @defaultValue "primary"
   */
  color?: 'primary' | 'secondary' | 'tertiary';

  /** Additional CSS class names. */
  className?: string;
}
