import { ButtonHTMLAttributes } from 'react';

export type ButtonProps = {
  /**
   * Visual style variant
   * @defaultValue "solid"
   */
  variant?: 'solid' | 'outline' | 'ghost' | 'text';

  /**
   * Color theme
   * @defaultValue "accent"
   */
  color?: 'accent' | 'danger' | 'neutral' | 'success';

  /**
   * Size of the button
   * @defaultValue "normal"
   */
  size?: 'small' | 'normal';

  /**
   * Whether the button is disabled
   * @defaultValue false
   */
  disabled?: boolean;

  /** Shows a loading spinner inside the button */
  loading?: boolean;

  /** Optional text to display next to the loading spinner */
  loaderText?: React.ReactNode;

  /** Icon element to display before button text */
  leadingIcon?: React.ReactNode;

  /** Icon element to display after button text */
  trailingIcon?: React.ReactNode;

  /** Custom maximum width for the button */
  maxWidth?: string | number;

  /** Custom width for the button */
  width?: string | number;

  /**
   * Whether the component renders a native <button> element when replacing it via the render prop. Set to false if the rendered element is not a button (e.g. <div>).
   * Defaults to false when render prop is provided.
   */
  nativeButton?: boolean;

  /**
   * Whether the button should be focusable when disabled.
   * Defaults to true when loading is true.
   */
  focusableWhenDisabled?: boolean;

  /**
   * Allows rendering the button as a different element.
   * Accepts a React element or a function that receives props and returns an element.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>
    | ((props: ButtonHTMLAttributes<HTMLButtonElement>) => React.ReactElement);

  /** Additional CSS class names */
  className?: string;
};
