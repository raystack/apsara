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

  /**
   * Largest allowed floating size, always additionally clamped by the
   * viewport.
   * @defaultValue the initial floating size — out of the box the window can
   * only shrink; pass a larger `maxSize` to let it grow.
   */
  maxSize?: ChatPanelSize;

  /**
   * Which axes the floating window can be resized on; mirrors the CSS
   * `resize` property vocabulary.
   * @defaultValue "both"
   */
  resize?: 'both' | 'horizontal' | 'vertical' | 'none';

  /**
   * Whether the floating window can be dragged by its header.
   * @defaultValue true
   */
  draggable?: boolean;

  /**
   * Confines floating-window dragging to an element instead of the
   * viewport. Accepts the element or a ref to it.
   */
  dragBoundary?: HTMLElement | React.RefObject<HTMLElement | null>;

  /**
   * How a mode change animates. `"minimal"` eases the new mode in from its own
   * edge or corner; `"morph"` measures the box the panel is leaving and tweens
   * the new mode out of it, so the panel moves and reshapes into place.
   * @defaultValue "minimal"
   */
  transition?: 'minimal' | 'morph';

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
   * Whether the minimized bubble can be dragged around the viewport. The
   * dropped position is kept across minimize/restore cycles.
   * @defaultValue false
   */
  draggable?: boolean;

  /**
   * Accessible name of the bubble.
   * @defaultValue "Open chat"
   */
  'aria-label'?: string;

  /** Custom CSS class names. */
  className?: string;
}
