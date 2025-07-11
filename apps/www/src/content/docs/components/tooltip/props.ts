export interface TooltipProps {
  /**
   * Content to display in the tooltip.
   */
  message: string | React.ReactNode;

  /**
   * Element that triggers the tooltip.
   */
  children: React.ReactNode;

  /**
   * Position of the tooltip relative to the trigger.
   * @default "top"
   */
  side?:
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';

  /**
   * Whether the tooltip should follow the cursor.
   * @default false
   */
  followCursor?: boolean;

  /**
   * Whether the tooltip is disabled.
   * @default false
   */
  disabled?: boolean;

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
   * @default false
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Delay before showing the tooltip, in milliseconds.
   * Overrides the prop of TooltipProvider.
   * @default 200
   */
  delayDuration?: number;

  /**
   * Prevents Tooltip from remaining open when hovering. Disabling this has accessibility consequences.
   * Overrides the prop of TooltipProvider.
   */
  disableHoverableContent?: boolean;

  /**
   * Additional ID for Tooltip Content
   */
  id?: string;

  /**
   * Additional CSS class names.
   */
  className?: string;
}

export interface TooltipProviderProps {
  /**
   * Delay before showing the tooltip, in milliseconds.
   * @default 200
   */
  delayDuration?: number;

  /**
   * Delay before showing the tooltip when moving between tooltips, in milliseconds.
   * @default 200
   */
  skipDelayDuration?: number;

  /**
   * Prevents Tooltip from remaining open when hovering. Disabling this has accessibility consequences.
   */
  disableHoverableContent?: boolean;
}
