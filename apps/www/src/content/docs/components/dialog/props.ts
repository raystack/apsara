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
  /**
   * Hides the close button.
   * @default false
   */
  hideCloseButton?: boolean;

  /**
   * Turns off the scale and offset of a dialog that has a nested dialog open.
   * @default false
   */
  disableNestedAnimation?: boolean;

  /** Overlay configuration including blur, className, and style */
  overlay?: {
    blur?: boolean;
    className?: string;
    style?: React.CSSProperties;
    forceRender?: boolean;
  } & React.ComponentPropsWithoutRef<'div'>;

  /** Additional CSS class names */
  className?: string;

  /**
   * Corner radius for this dialog only. Overrides the theme's `radius`.
   * @defaultValue The theme's `radius`
   */
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
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

export interface DialogCloseButtonProps {
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

export interface DialogFooterProps {
  /** Additional CSS class names */
  className?: string;

  children?: React.ReactNode;
}
