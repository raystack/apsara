export interface AnnouncementBarProps {
  /**
   * Intent color of the bar.
   * @defaultValue "neutral"
   */
  color?: 'neutral' | 'danger' | 'gradient';

  /**
   * Text content for the component
   */
  text: React.ReactNode;

  /** Icon element to display before the text */
  leadingIcon?: React.ReactNode;

  /** Text of the onClick action. It will be display after the text. */
  actionLabel?: string;

  /** Icon of the onClick action.*/
  actionIcon?: React.ReactNode;

  /** Called when the action button is clicked. */
  onActionClick?: () => void;

  /**
   * Shows a dismiss (close) button at the end of the bar.
   * @defaultValue false
   */
  dismissible?: boolean;

  /** Called when the dismiss button is clicked. When set, the bar does not hide itself. */
  onDismiss?: () => void;

  /** Additional CSS class names */
  className?: string;
}
