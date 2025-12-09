export interface SkeletonProps {
  /**
   * Width of the skeleton
   * @defaultValue "50px for inline, 100% otherwise"
   */
  width?: string | number;

  /**
   * Height of the skeleton
   * @defaultValue "var(--rs-space-4)"
   */
  height?: string | number;

  /**
   * Base color of the skeleton
   * @defaultValue "var(--rs-color-background-base-primary-hover)"
   */
  baseColor?: string;

  /**
   * Color of the shimmer effect
   * @defaultValue "var(--rs-color-background-base-primary)"
   */
  highlightColor?: string;

  /**
   * Border radius of the skeleton
   * @defaultValue "var(--rs-radius-2)"
   */
  borderRadius?: string | number;

  /**
   * Whether to display as inline-block
   * @defaultValue false
   */
  inline?: boolean;

  /**
   * Duration of the animation in seconds
   * @defaultValue 1.5
   */
  duration?: number;

  /**
   * Whether to enable the shimmer animation
   * @defaultValue true
   */
  enableAnimation?: boolean;

  /**
   * Number of skeleton elements to render
   * @defaultValue 1
   */
  count?: number;

  /**
   * Additional CSS class names for the skeleton element
   */
  className?: string;

  /**
   * Additional inline styles for the skeleton element
   */
  style?: React.CSSProperties;

  /**
   * Additional CSS class names for the container element (div for block and span for inline)
   */
  containerClassName?: string;

  /**
   * Additional inline styles for the container element (div for block and span for inline)
   */
  containerStyle?: React.CSSProperties;
}
