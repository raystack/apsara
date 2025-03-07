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
  /**
   * Accessible label for the popover content.
   * @default "Popover content"
   */
  ariaLabel?: string;

  /** Preferred side of the trigger to render. */
  side?: "top" | "right" | "bottom" | "left";

  /** Distance in pixels from the trigger. */
  sideOffset?: number;

  /** Alignment relative to trigger. */
  align?: "start" | "center" | "end";

  /** Offset in pixels from alignment edge. */
  alignOffset?: number;

  /** Boolean to prevent collision with viewport edges. */
  avoidCollisions?: boolean;

  /** Padding between content and viewport edges. */
  collisionPadding?: number;
}

export interface PopoverTriggerProps {
  /** Boolean to merge props onto child element. */
  asChild?: boolean;
}
