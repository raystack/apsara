export interface SkeletonProps {
  /**
   * Width of the skeleton
   */
  width?: string | number;

  /**
   * Height of the skeleton
   */
  height?: string | number;

  /**
   * Base color of the skeleton
   * @defaultValue "var(--rs-color-background-neutral-secondary)"
   */
  baseColor?: string;

  /**
   * Color of the shimmer effect
   * @defaultValue "var(--rs-color-background-base-primary)"
   */
  highlightColor?: string;

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
   * Additional CSS class names
   */
  className?: string;

  /**
   * Additional inline styles
   */
  style?: React.CSSProperties;
} 