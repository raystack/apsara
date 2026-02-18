export interface PopoverRootProps {
  /** Boolean to control the default open state. */
  defaultOpen?: boolean;

  /** Controlled open state. */
  open?: boolean;

  /** Callback when open state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Boolean to enable modal behavior. */
  modal?: boolean;
}

export interface PopoverContentProps {
  /** Preferred side of the trigger to render. */
  side?: 'top' | 'right' | 'bottom' | 'left';

  /** Alignment relative to trigger. */
  align?: 'start' | 'center' | 'end';

  /** Distance in pixels from the trigger. */
  sideOffset?: number;

  /** Offset in pixels from alignment edge. */
  alignOffset?: number;

  /** Padding between content and viewport edges. */
  collisionPadding?: number;

  /** Boundary element for collision detection. */
  collisionBoundary?: Element | Element[] | null;

  /** Additional CSS class name. */
  className?: string;

  /** Additional inline styles. */
  style?: React.CSSProperties;

  /** Custom render function.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement
    | ((props: any, state: any) => React.ReactElement);

  /** Element to receive initial focus when popover opens. */
  initialFocus?: boolean | number | React.RefObject<HTMLElement>;

  /** Element to receive focus when popover closes. */
  finalFocus?: boolean | React.RefObject<HTMLElement>;

  /** Content to render inside the popover. */
  children?: React.ReactNode;
}

export interface PopoverTriggerProps {
  /** Additional CSS class name. */
  className?: string;
}
