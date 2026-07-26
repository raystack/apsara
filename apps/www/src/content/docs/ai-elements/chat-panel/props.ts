import type React from 'react';

export interface ChatPanelPosition {
  x: number;
  y: number;
}

export interface ChatPanelSize {
  width: number;
  height: number;
}

export interface ChatPanelProps {
  /** Presentation mode of the panel (controlled). */
  mode?: 'docked' | 'floating' | 'minimized';

  /**
   * Initial mode when uncontrolled.
   * @defaultValue "docked"
   */
  defaultMode?: 'docked' | 'floating' | 'minimized';

  /** Called when the mode changes. */
  onModeChange?: (mode: 'docked' | 'floating' | 'minimized') => void;

  /**
   * Which edge the panel docks to; also picks the corner used by the
   * floating default position and the minimized trigger.
   * @defaultValue "right"
   */
  side?: 'left' | 'right';

  /** Floating window position in viewport pixels (controlled). */
  position?: ChatPanelPosition | null;

  /**
   * Initial floating position when uncontrolled. When omitted the window
   * starts at the bottom corner on the docked `side`.
   */
  defaultPosition?: ChatPanelPosition;

  /** Called when a drag ends or resizing moves the floating window. */
  onPositionChange?: (position: ChatPanelPosition) => void;

  /** Floating window size in pixels (controlled). */
  size?: ChatPanelSize;

  /**
   * Initial floating size when uncontrolled.
   * @defaultValue { width: 400, height: 560 }
   */
  defaultSize?: ChatPanelSize;

  /** Called when resizing changes the floating window size. */
  onSizeChange?: (size: ChatPanelSize) => void;

  /**
   * Smallest allowed floating size.
   * @defaultValue { width: 280, height: 320 }
   */
  minSize?: ChatPanelSize;

  /** Largest allowed floating size. Defaults to the viewport. */
  maxSize?: ChatPanelSize;

  /**
   * Confines floating-window dragging to an element instead of the
   * viewport. Accepts the element or a ref to it.
   */
  dragBoundary?: HTMLElement | React.RefObject<HTMLElement | null>;

  /** Custom CSS class names. */
  className?: string;
}

export interface ChatPanelTriggerProps {
  /**
   * Bubble content. Defaults to a chat icon; compose `Indicator` or `Badge`
   * for unread counts.
   */
  children?: React.ReactNode;

  /**
   * Accessible name of the bubble.
   * @defaultValue "Open chat"
   */
  'aria-label'?: string;

  /** Custom CSS class names. */
  className?: string;
}
