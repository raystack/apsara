export interface FloatingActionsProps {
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
  /** Additional CSS class names. */
  className?: string;
}
