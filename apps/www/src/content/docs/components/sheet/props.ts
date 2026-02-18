export interface SheetProps {
  /** Boolean to control the default open state. */
  defaultOpen?: boolean;

  /** Controlled open state. */
  open?: boolean;

  /** Callback when open state changes. */
  onOpenChange?: (open: boolean) => void;
}

export interface SheetContentProps {
  /** The direction from which the sheet appears. */
  side?: 'top' | 'right' | 'bottom' | 'left';

  /** Whether to show the close button. */
  showCloseButton?: boolean;

  /** Props to pass to the backdrop/overlay component. */
  overlayProps?: {
    className?: string;
    style?: React.CSSProperties;

    forceRender?: boolean;
  };

  /** The content to be rendered inside the sheet. */
  children?: React.ReactNode;

  /** Additional CSS class name. */
  className?: string;

  /** Additional inline styles. */
  style?: React.CSSProperties;
}
