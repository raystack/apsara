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
  onOpenChange?: (open: boolean, eventDetails: unknown) => void;

  /**
   * Event handler called after any animations complete when the tooltip is opened or closed.
   */
  onOpenChangeComplete?: (open: boolean) => void;

  /**
   * Whether the tooltip contents can be hovered without closing the tooltip.
   * @default false
   */
  disableHoverablePopup?: boolean;

  /**
   * Whether the tooltip is disabled.
   * @default false
   */
  disabled?: boolean;

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
   * How long to wait before opening the tooltip on hover, in milliseconds.
   * @default 200
   */
  delay?: number;

  /**
   * How long to wait before closing the tooltip, in milliseconds.
   * @default 0
   */
  closeDelay?: number;

  /**
   * Whether the tooltip closes when the trigger is clicked.
   * @default true
   */
  closeOnClick?: boolean;

  /**
   * Stops the tooltip from opening from this trigger. It does not disable the trigger element.
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;
}

export interface TooltipViewportProps {
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

  /**
   * Accessible label for the tooltip popup. Use when `children` is a
   * ReactNode (icons, custom markup) that wouldn't expose a readable name
   * on its own.
   */
  'aria-label'?: string;

  /**
   * ID of an element that labels the tooltip popup. Alternative to
   * `aria-label` when the labelling text lives elsewhere in the DOM.
   */
  'aria-labelledby'?: string;

  /**
   * Corner radius for this tooltip only. Overrides the theme's `radius`.
   * @defaultValue The theme's `radius`
   */
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
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
