export interface ToastProps {
  /**
   * Text shown below the title.
   */
  description?: string;

  /**
   * Auto-close time in milliseconds.
   * @default 4000
   */
  duration?: number;

  /**
   * Toast position on screen.
   * @default "bottom-right"
   */
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";

  /**
   * Allow user to dismiss toast.
   * @default true
   */
  dismissible?: boolean;

  /**
   * Leading icon element.
   */
  icon?: React.ReactNode;

  /**
   * Inverts the color scheme.
   * @default false
   */
  invert?: boolean;

  /**
   * Show close button.
   * @default false
   */
  closeButton?: boolean;

  /**
   * Remove default styling.
   * @default false
   */
  unstyled?: boolean;

  /**
   * Primary button configuration.
   */
  action?: {
    label: string;
    onClick: () => void;
  };

  /**
   * Secondary button configuration.
   */
  cancel?: {
    label: string;
    onClick: () => void;
  };

  /**
   * Styles for the primary button.
   * @default {}
   */
  actionButtonStyle?: React.CSSProperties;

  /**
   * Styles for the secondary button.
   * @default {}
   */
  cancelButtonStyle?: React.CSSProperties;

  /**
   * Called on manual dismiss.
   */
  onDismiss?: () => void;

  /**
   * Called when the toast auto-closes.
   */
  onAutoClose?: () => void;

  /**
   * Custom toast ID.
   */
  id?: string;
}
