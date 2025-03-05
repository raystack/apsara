export type ButtonProps = {
  /**
   * Visual style variant
   * @defaultValue "solid"
   */
  variant?: "solid" | "outline" | "ghost" | "text";

  /**
   * Color theme
   * @defaultValue "accent"
   */
  color?: "accent" | "danger" | "neutral" | "success";

  /**
   * Size of the button
   * @defaultValue "normal"
   */
  size?: "small" | "normal";

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

  /** Boolean to merge props onto child element */
  asChild?: boolean;

  /** Additional CSS class names */
  className?: string;
};
