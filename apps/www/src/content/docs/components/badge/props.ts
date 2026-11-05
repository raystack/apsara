export interface BadgeProps {
  /**
   * Intent color of the badge.
   * @defaultValue "accent"
   */
  color?:
    | 'accent'
    | 'attention'
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

  /**
   * Corner radius for this badge only. Overrides the theme's `radius`.
   * @defaultValue The theme's `radius`
   */
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}
