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

  /**
   * Controls whether to show the close button
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Toggle nested dialog animation (scaling and translation)
   * @default true
   */
  showNestedAnimation?: boolean;

  /** Overlay configuration including blur, className, and style */
  overlay?: {
    blur?: boolean;
    className?: string;
    style?: React.CSSProperties;
    forceRender?: boolean;
  } & React.ComponentPropsWithoutRef<'div'>;

  /** Additional CSS class names */
  className?: string;
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
