export interface TooltipProps {
  /**
   * The controlled open state of the tooltip.
   */
  open?: boolean;

  /**
   * The initial open state of the tooltip.
   */
  defaultOpen?: boolean;

  /**
   * Event handler called when the open state of the tooltip changes.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Delay before showing the tooltip, in milliseconds.
   * @default 200
   */
  delayDuration?: number;

  /**
   * Prevents Tooltip from remaining open when hovering. Disabling this has accessibility consequences.
   */
  disableHoverableContent?: boolean;

  /**
   * Track cursor axis ('none', 'x', 'y', or 'both')
   * @default 'none'
   */
  trackCursorAxis?: 'none' | 'x' | 'y' | 'both';
}

export interface TooltipTriggerProps {
  /**
   * React element to render as the trigger. Props will be merged onto this element.
   */
  render?: React.ReactElement;

  /**
   * Additional CSS class names
   */
  className?: string;
}

export interface TooltipContentProps {
  /**
   * Controls whether to show the arrow
   * @default false
   */
  showArrow?: boolean;

  /**
   * Side placement of the tooltip
   * @default "top"
   */
  side?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * Alignment of the tooltip
   * @default "center"
   */
  align?: 'start' | 'center' | 'end';

  /**
   * Side offset for positioning
   * @default 4
   */
  sideOffset?: number;

  /**
   * Align offset for positioning
   * @default 0
   */
  alignOffset?: number;

  /**
   * Additional CSS class names
   */
  className?: string;
}

export interface TooltipProviderProps {
  /**
   * How long to wait before opening a tooltip. Specified in milliseconds.
   * @default 200
   */
  delay?: number;

  /**
   * How long to wait before closing a tooltip. Specified in milliseconds.
   */
  closeDelay?: number;

  /**
   * Another tooltip will open instantly if the previous tooltip is closed within this timeout. Specified in milliseconds.
   * @default 400
   */
  timeout?: number;
}
