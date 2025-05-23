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
   * Whether the tooltip is disabled.
   * @default false
   */
  disabled?: boolean;

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
   * Additional ID for Tooltip Content
   */
  id?: string;

  /**
   * Additional CSS class names.
   */
  className?: string;
}
