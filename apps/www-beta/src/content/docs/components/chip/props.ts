export interface ChipProps {
  /**
   * Visual style variant
   * @defaultValue "outline"
   */
  variant?: 'outline' | 'filled';

  /**
   * Size of the chip
   * @defaultValue "small"
   */
  size?: 'small' | 'large';

  /**
   * Color style
   * @defaultValue "neutral"
   */
  color?: 'neutral' | 'accent';

  /** ReactNode to display as an icon before the label */
  leadingIcon?: React.ReactNode;

  /** ReactNode to display as an icon after the label */
  trailingIcon?: React.ReactNode;

  /**
   * Boolean to show a dismiss button (replaces trailingIcon)
   */
  isDismissible?: boolean;

  /** Callback function when dismiss button is clicked */
  onDismiss?: () => void;

  /** Content to display inside the chip */
  children?: React.ReactNode;

  /** Additional CSS class names */
  className?: string;

  /**
   * ARIA role for the chip
   * @defaultValue "status"
   */
  role?: string;

  /** Custom accessibility label for the chip */
  ariaLabel?: string;
}
