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
   * Visual style variant.
   * @defaultValue "solid"
   */
  variant?: 'solid' | 'outline';

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

  /**
   * Called when the dismiss button is clicked. When provided, the consumer owns
   * removal (the callout stays mounted). When omitted, the callout hides itself.
   */
  onDismiss?: () => void;

  /** Text content of the callout */
  children?: React.ReactNode;

  /** Additional CSS class names */
  className?: string;
}
