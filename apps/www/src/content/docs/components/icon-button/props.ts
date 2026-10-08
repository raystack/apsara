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

  /**
   * Shows a spinner in place of the icon and blocks clicks. The button stays focusable.
   * @default false
   */
  loading?: boolean;

  /**
   * Whether the button stays focusable when disabled.
   * @default true when `loading`, otherwise false
   */
  focusableWhenDisabled?: boolean;

  /**
   * Renders the button as a different element.
   * Accepts a React element or a function that receives props and returns an element.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>
    | ((
        props: React.ButtonHTMLAttributes<HTMLButtonElement>
      ) => React.ReactElement);

  /**
   * Whether the rendered element is a native `<button>`. Set to `true` when `render` returns a `<button>`.
   * @default true, or false when `render` is set
   */
  nativeButton?: boolean;

  /** Additional CSS class names. */
  className?: string;

  /** onClick function triggered when iconButton is clicked. */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Corner radius for this button only. Overrides the theme's `radius`.
   * @defaultValue The theme's `radius`
   */
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}
