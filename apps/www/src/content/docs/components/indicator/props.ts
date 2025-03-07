export interface IndicatorProps {
  /**
   * Visual style variant
   * @default "accent"
   */
  variant?: "accent" | "warning" | "danger" | "success" | "neutral";

  /** Optional text label to display (if omitted, shows a dot) */
  label?: string;

  /** Optional custom description for screen readers */
  ariaLabel?: string;

  /** The content to show the indicator on */
  children: React.ReactNode;

  /** Additional CSS class names */
  className?: string;
}
