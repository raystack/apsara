export interface PreviewCardRootProps {
  /** Whether the preview card is open (controlled). */
  open?: boolean;

  /**
   * Whether the preview card is initially open (uncontrolled).
   * @defaultValue false
   */
  defaultOpen?: boolean;

  /** Callback when the open state changes. */
  onOpenChange?: (open: boolean) => void;
}

export interface PreviewCardTriggerProps {
  /** The URL that the link points to. */
  href?: string;

  /**
   * Wait time in milliseconds before the preview card opens.
   * @defaultValue 600
   */
  delay?: number;

  /**
   * Wait time in milliseconds before the preview card closes.
   * @defaultValue 300
   */
  closeDelay?: number;

  /** Additional CSS class name. */
  className?: string;
}

export interface PreviewCardContentProps {
  /** Preferred side of the trigger to render.
   * @defaultValue 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left';

  /** Alignment relative to trigger.
   * @defaultValue 'center'
   */
  align?: 'start' | 'center' | 'end';

  /** Distance in pixels from the trigger.
   * @defaultValue 4
   */
  sideOffset?: number;

  /** Offset in pixels from alignment edge. */
  alignOffset?: number;

  /** Padding between content and viewport edges. */
  collisionPadding?: number;

  /**
   * Controls whether to show the arrow.
   * @defaultValue false
   */
  showArrow?: boolean;

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

  /** Content to render inside the preview card. */
  children?: React.ReactNode;
}

export interface PreviewCardViewportProps {
  /** Additional CSS class name. */
  className?: string;

  /** Content to render inside the viewport. */
  children?: React.ReactNode;
}
