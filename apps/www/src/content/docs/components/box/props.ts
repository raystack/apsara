export interface BoxProps {
  /** Content rendered inside the box */
  children?: React.ReactNode;

  /** Custom CSS class names */
  className?: string;

  /** Inline styles applied to the underlying `<div>` */
  style?: React.CSSProperties;
}
