export interface Props {
  /**
   * Specifies the size of the avatar (1-13)
   * @defaultValue 3
   */
  size?: number;

  /** The URL of the image to display */
  src?: string;

  /** Alternative text description for the image */
  alt?: string;

  /** Content to display when image fails to load or while loading */
  fallback?: React.ReactNode;

  /**
   * Visual style variant
   * @defaultValue "soft"
   */
  variant?: "solid" | "soft";

  /**
   * Border radius style
   * @defaultValue "small"
   */
  radius?: "small" | "full";

  /**
   * Color theme for the avatar
   */
  color?:
    | "indigo"
    | "orange"
    | "mint"
    | "neutral"
    | "sky"
    | "lime"
    | "grass"
    | "cyan"
    | "iris"
    | "purple"
    | "pink"
    | "crimson"
    | "gold";

  /** Boolean to merge props onto child element */
  asChild?: boolean;

  /** Additional CSS class names */
  className?: string;
}
