export interface CollapsibleProps {
  /**
   * Whether the panel is open (controlled).
   */
  open?: boolean;

  /**
   * Whether the panel is initially open (uncontrolled).
   * @defaultValue false
   */
  defaultOpen?: boolean;

  /**
   * Event handler called when the open state changes.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Whether the collapsible is disabled.
   * @defaultValue false
   */
  disabled?: boolean;

  /** Custom CSS class names */
  className?: string;
}

export interface CollapsibleTriggerProps {
  /** Custom CSS class names */
  className?: string;
}

export interface CollapsiblePanelProps {
  /**
   * Whether to keep the element in the DOM while the panel is closed.
   * @defaultValue false
   */
  keepMounted?: boolean;

  /**
   * Allows the browser's built-in page search to find and expand the panel contents.
   * @defaultValue false
   */
  hiddenUntilFound?: boolean;

  /** Custom CSS class names */
  className?: string;
}
