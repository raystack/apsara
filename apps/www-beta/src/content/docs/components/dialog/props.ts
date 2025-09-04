export interface DialogProps {
  /** Controls the open state of the dialog */
  open?: boolean;

  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;

  /**
   * Whether the dialog is modal
   * @default true
   */
  modal?: boolean;
}

export interface DialogContentProps {
  /** Controls dialog width */
  width?: string | number;

  /** Enables backdrop blur effect */
  overlayBlur?: boolean;

  /** Custom class for overlay styling */
  overlayClassName?: string;

  /** Custom styles for overlay */
  overlayStyle?: React.CSSProperties;

  /** Additional CSS class names */
  className?: string;

  /** Position of the dialog */
  side?: 'top' | 'right' | 'bottom' | 'left';

  /** Accessible label for the dialog */
  ariaLabel?: string;

  /** Detailed description for screen readers */
  ariaDescription?: string;
}

export interface DialogHeaderProps {
  /** Additional CSS class names */
  className?: string;

  children?: React.ReactNode;
}

export interface DialogBodyProps {
  /** Additional CSS class names */
  className?: string;

  children?: React.ReactNode;
}

export interface DialogTitleProps {
  /** Additional CSS class names */
  className?: string;

  children?: React.ReactNode;
}

export interface DialogDescriptionProps {
  /** Additional CSS class names for description */
  className?: string;
}

export interface DialogTriggerProps {
  /** Boolean to merge props onto child element */
  asChild?: boolean;

  /** Additional CSS class names */
  className?: string;
}

export interface DialogCloseButtonProps {
  /** Boolean to merge props onto child element */
  asChild?: boolean;

  /** Additional CSS class names */
  className?: string;
}

export interface DialogFooterProps {
  /** Additional CSS class names */
  className?: string;

  children?: React.ReactNode;
}
