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
   * Color style. `danger`, `success` and `warning` convey status.
   * @defaultValue "neutral"
   */
  color?: 'neutral' | 'accent' | 'danger' | 'success' | 'warning';

  /** ReactNode to display as an icon before the label */
  leadingIcon?: React.ReactNode;

  /** ReactNode to display as an icon after the label */
  trailingIcon?: React.ReactNode;

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
  'aria-label'?: string;

  /**
   * Corner radius for this chip only. Overrides the theme's `radius`.
   * @defaultValue The theme's `radius`
   */
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';

  /** Ref to the rendered element. */
  ref?: React.Ref<HTMLSpanElement>;

  /** Renders the chip as another element, or with a function that receives the chip props. */
  render?: React.ReactElement | ((props: object) => React.ReactElement);
}

export interface ChipRemoveProps {
  /** Called when the button is pressed. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;

  /**
   * Accessible name of the button.
   * @defaultValue "Remove" plus the chip text
   */
  'aria-label'?: string;

  /**
   * The icon inside the button.
   * @defaultValue <XIcon />
   */
  children?: React.ReactNode;

  /** Renders the button as another element, or with a function that receives the button props. */
  render?: React.ReactElement | ((props: object) => React.ReactElement);

  /** Additional CSS class names */
  className?: string;
}
