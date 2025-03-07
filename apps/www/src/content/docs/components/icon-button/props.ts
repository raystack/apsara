export interface IconButtonProps {
  /**
   * Size of the button.
   * @default 2
   */
  size?: 1 | 2 | 3 | 4;

  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;

  /** Additional CSS class names. */
  className?: string;

  /** onClick function triggered when iconButton is clicked. */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
