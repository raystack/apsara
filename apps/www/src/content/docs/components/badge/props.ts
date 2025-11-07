export interface BadgeProps {
  /**
   * Visual style variant
   * @defaultValue "accent"
   */
  variant?:
    | 'accent'
    | 'warning'
    | 'danger'
    | 'success'
    | 'neutral'
    | 'gradient';

  /**
   * Size of the badge
   * @defaultValue "small"
   */
  size?: 'micro' | 'small' | 'regular';

  /** Optional ReactNode to display an icon before the text */
  icon?: React.ReactNode;

  /** Additional text content only announced to screen readers */
  screenReaderText?: string;

  /** Text content of the badge */
  children?: React.ReactNode;

  /** Additional CSS class names */
  className?: string;
}
