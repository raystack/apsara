export interface AnnouncementBarProps {
  /**
   * Visual style variant
   * @defaultValue "normal"
   */
  variant?: "normal" | "error" | "gradient";

  /**
   * Text content for the component
   */
  text: string;

  /** Icon element to display before the text */
  leadingIcon?: React.ReactNode;

  /** Text of the onClick action. It will be display after the text. */
  actionLabel?: string;

  /** Icon of the onClick action.*/
  actionIcon?: React.ReactNode;

  /** Additional CSS class names */
  className?: string;
}
