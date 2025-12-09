export interface CalloutProps {
  /**
   * Visual style variant
   * @defaultValue "grey"
   */
  type?:
    | 'grey'
    | 'success'
    | 'alert'
    | 'gradient'
    | 'accent'
    | 'attention'
    | 'normal';

  /**
   * Whether to show an outline border
   * @defaultValue false
   */
  outline?: boolean;

  /**
   * Whether to use high contrast colors
   * @defaultValue false
   */
  highContrast?: boolean;

  /** Optional action element to display on the right */
  action?: React.ReactNode;

  /**
   * Whether to show a dismiss button
   * @defaultValue false
   */
  dismissible?: boolean;

  /**
   * Custom leading icon
   * @defaultValue InfoCircledIcon
   */
  icon?: React.ReactNode;

  /** Callback function when dismiss button is clicked */
  onDismiss?: () => void;

  /** Text content of the callout */
  children?: React.ReactNode;

  /** Custom width for the callout */
  width?: string | number;

  /** Additional CSS class names */
  className?: string;
}
