export interface AlertDialogProps {
  /** Controls the open state of the alert dialog */
  open?: boolean;

  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

export interface AlertDialogContentProps {
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

export interface AlertDialogHeaderProps {
  /** Additional CSS class names */
  className?: string;

  children?: React.ReactNode;
}

export interface AlertDialogBodyProps {
  /** Additional CSS class names */
  className?: string;

  children?: React.ReactNode;
}

export interface AlertDialogTitleProps {
  /** Additional CSS class names */
  className?: string;

  children?: React.ReactNode;
}

export interface AlertDialogDescriptionProps {
  /** Additional CSS class names for description */
  className?: string;
}

export interface AlertDialogTriggerProps {
  /**
   * Allows rendering as a different element.
   * Accepts a React element or a function that receives props and returns an element.
   *
   * @remarks `ReactElement | function`
   */
  render?: React.ReactElement;

  /** Additional CSS class names */
  className?: string;
}

export interface AlertDialogFooterProps {
  /** Additional CSS class names */
  className?: string;

  children?: React.ReactNode;
}
