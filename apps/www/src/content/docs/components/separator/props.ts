export interface SeparatorProps {
  /** Defines the length of the separator.
   * @default "full"
   */
  size?: "small" | "half" | "full";

  /** Sets the color of the separator.
   * @default "primary"
   */
  color?: "primary" | "secondary" | "tertiary";

  /** Sets the direction of the separator.
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /** Additional CSS class names. */
  className?: string;
}
