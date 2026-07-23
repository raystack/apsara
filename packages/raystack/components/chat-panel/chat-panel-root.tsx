'use client';

import { useControlled } from '@base-ui/utils/useControlled';
import { cx } from 'class-variance-authority';
import {
  ComponentProps,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import styles from './chat-panel.module.css';
import {
  ChatPanelContext,
  type ChatPanelContextValue,
  type ChatPanelMode,
  type ChatPanelSide
} from './chat-panel-context';

export interface ChatPanelPosition {
  x: number;
  y: number;
}

export interface ChatPanelSize {
  width: number;
  height: number;
}

/** Keep at least this much of the header on screen while clamping. */
const HEADER_SAFE_PX = 48;

const DEFAULT_SIZE: ChatPanelSize = { width: 400, height: 560 };
const DEFAULT_MIN_SIZE: ChatPanelSize = { width: 280, height: 320 };

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const RESIZE_DIRECTIONS: ResizeDirection[] = [
  'n',
  's',
  'e',
  'w',
  'ne',
  'nw',
  'se',
  'sw'
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

export interface ChatPanelRootProps extends ComponentProps<'aside'> {
  /** Presentation mode of the panel (controlled). */
  mode?: ChatPanelMode;
  /**
   * Initial mode when uncontrolled.
   * @defaultValue "docked"
   */
  defaultMode?: ChatPanelMode;
  /** Called when the mode changes. */
  onModeChange?: (mode: ChatPanelMode) => void;
  /**
   * Which edge the panel docks to; also picks the corner used by the
   * floating default position and the minimized trigger.
   * @defaultValue "right"
   */
  side?: ChatPanelSide;
  /** Floating window position in viewport pixels (controlled). */
  position?: ChatPanelPosition | null;
  /**
   * Initial floating position when uncontrolled. When omitted the window
   * starts at the bottom corner on the docked `side`.
   */
  defaultPosition?: ChatPanelPosition;
  /** Called when dragging or resizing moves the floating window. */
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
}

export function ChatPanelRoot({
  className,
  children,
  style,
  mode: modeProp,
  defaultMode = 'docked',
  onModeChange,
  side = 'right',
  position: positionProp,
  defaultPosition,
  onPositionChange,
  size: sizeProp,
  defaultSize,
  onSizeChange,
  minSize,
  maxSize,
  ref,
  ...props
}: ChatPanelRootProps) {
  const panelRef = useRef<HTMLElement | null>(null);

  const [mode, setModeUnwrapped] = useControlled({
    controlled: modeProp,
    default: defaultMode,
    name: 'ChatPanel',
    state: 'mode'
  });
  const [position, setPositionUnwrapped] =
    useControlled<ChatPanelPosition | null>({
      controlled: positionProp,
      default: defaultPosition ?? null,
      name: 'ChatPanel',
      state: 'position'
    });
  const [size, setSizeUnwrapped] = useControlled({
    controlled: sizeProp,
    default: defaultSize ?? DEFAULT_SIZE,
    name: 'ChatPanel',
    state: 'size'
  });

  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);

  const modeRef = useRef(mode);
  modeRef.current = mode;
  const positionRef = useRef(position);
  positionRef.current = position;
  const sizeRef = useRef(size);
  sizeRef.current = size;
  // The mode restored when leaving 'minimized'.
  const previousModeRef = useRef<Exclude<ChatPanelMode, 'minimized'>>(
    defaultMode === 'minimized' ? 'docked' : defaultMode
  );

  const onModeChangeRef = useRef(onModeChange);
  onModeChangeRef.current = onModeChange;
  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;
  const onSizeChangeRef = useRef(onSizeChange);
  onSizeChangeRef.current = onSizeChange;
  const minSizeRef = useRef(minSize ?? DEFAULT_MIN_SIZE);
  minSizeRef.current = minSize ?? DEFAULT_MIN_SIZE;
  const maxSizeRef = useRef(maxSize);
  maxSizeRef.current = maxSize;

  const setMode = useCallback(
    (next: ChatPanelMode) => {
      if (next === modeRef.current) return;
      if (modeRef.current !== 'minimized') {
        previousModeRef.current = modeRef.current as Exclude<
          ChatPanelMode,
          'minimized'
        >;
      }
      setModeUnwrapped(next);
      onModeChangeRef.current?.(next);
    },
    [setModeUnwrapped]
  );

  const setPosition = useCallback(
    (next: ChatPanelPosition) => {
      setPositionUnwrapped(next);
      onPositionChangeRef.current?.(next);
    },
    [setPositionUnwrapped]
  );

  const setSize = useCallback(
    (next: ChatPanelSize) => {
      setSizeUnwrapped(next);
      onSizeChangeRef.current?.(next);
    },
    [setSizeUnwrapped]
  );

  const clampPosition = useCallback(
    (next: ChatPanelPosition, width: number): ChatPanelPosition => ({
      x: Math.round(clamp(next.x, 0, window.innerWidth - width)),
      y: Math.round(clamp(next.y, 0, window.innerHeight - HEADER_SAFE_PX))
    }),
    []
  );

  /* ------------------------------- dragging ------------------------------ */

  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    width: number;
  } | null>(null);

  const handleDragDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (modeRef.current !== 'floating' || event.button !== 0) return;
      const target = event.target as Element;
      if (
        target.closest(
          'button, a, input, textarea, select, [data-chat-panel-no-drag]'
        )
      ) {
        return;
      }
      const panel = panelRef.current;
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      dragStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: rect.left,
        originY: rect.top,
        width: rect.width
      };
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    },
    []
  );

  const handleDragMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const state = dragStateRef.current;
      if (!state || event.pointerId !== state.pointerId) return;
      setPosition(
        clampPosition(
          {
            x: state.originX + event.clientX - state.startX,
            y: state.originY + event.clientY - state.startY
          },
          state.width
        )
      );
    },
    [clampPosition, setPosition]
  );

  const handleDragEnd = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const state = dragStateRef.current;
    if (!state || event.pointerId !== state.pointerId) return;
    dragStateRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  }, []);

  /* ------------------------------- resizing ------------------------------ */

  const resizeStateRef = useRef<{
    pointerId: number;
    direction: ResizeDirection;
    startX: number;
    startY: number;
    rect: { left: number; top: number; width: number; height: number };
  } | null>(null);

  const handleResizeDown = useCallback(
    (direction: ResizeDirection) =>
      (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) return;
        const panel = panelRef.current;
        if (!panel) return;
        const rect = panel.getBoundingClientRect();
        resizeStateRef.current = {
          pointerId: event.pointerId,
          direction,
          startX: event.clientX,
          startY: event.clientY,
          rect: {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
          }
        };
        // Anchor a corner-positioned panel so growing an edge doesn't slide
        // the opposite one.
        if (!positionRef.current) {
          setPosition({ x: Math.round(rect.left), y: Math.round(rect.top) });
        }
        event.currentTarget.setPointerCapture(event.pointerId);
        setResizing(true);
        event.preventDefault();
      },
    [setPosition]
  );

  const handleResizeMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const state = resizeStateRef.current;
      if (!state || event.pointerId !== state.pointerId) return;
      const { direction, rect } = state;
      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;
      const min = minSizeRef.current;
      const maxWidth = Math.min(
        maxSizeRef.current?.width ?? Infinity,
        window.innerWidth
      );
      const maxHeight = Math.min(
        maxSizeRef.current?.height ?? Infinity,
        window.innerHeight
      );
      let { left, top, width, height } = rect;
      if (direction.includes('e')) {
        width = clamp(
          rect.width + dx,
          min.width,
          Math.min(maxWidth, window.innerWidth - rect.left)
        );
      }
      if (direction.includes('s')) {
        height = clamp(
          rect.height + dy,
          min.height,
          Math.min(maxHeight, window.innerHeight - rect.top)
        );
      }
      if (direction.includes('w')) {
        const right = rect.left + rect.width;
        width = clamp(rect.width - dx, min.width, Math.min(maxWidth, right));
        left = right - width;
      }
      if (direction.includes('n')) {
        const bottom = rect.top + rect.height;
        height = clamp(
          rect.height - dy,
          min.height,
          Math.min(maxHeight, bottom)
        );
        top = bottom - height;
      }
      setSize({ width: Math.round(width), height: Math.round(height) });
      if (direction.includes('w') || direction.includes('n')) {
        setPosition({ x: Math.round(left), y: Math.round(top) });
      }
    },
    [setPosition, setSize]
  );

  const handleResizeEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const state = resizeStateRef.current;
      if (!state || event.pointerId !== state.pointerId) return;
      resizeStateRef.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setResizing(false);
    },
    []
  );

  // Keep the floating window reachable when the viewport shrinks.
  useEffect(() => {
    if (mode !== 'floating' || typeof window === 'undefined') return;
    const handleWindowResize = () => {
      const current = positionRef.current;
      const panel = panelRef.current;
      if (!current || !panel) return;
      const next = clampPosition(current, panel.getBoundingClientRect().width);
      if (next.x !== current.x || next.y !== current.y) setPosition(next);
    };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [mode, clampPosition, setPosition]);

  const contextValue = useMemo<ChatPanelContextValue>(
    () => ({
      mode,
      side,
      setMode,
      minimize: () => setMode('minimized'),
      restore: () => setMode(previousModeRef.current),
      toggleFloating: () =>
        setMode(modeRef.current === 'floating' ? 'docked' : 'floating'),
      dragHandlers: {
        onPointerDown: handleDragDown,
        onPointerMove: handleDragMove,
        onPointerUp: handleDragEnd,
        onPointerCancel: handleDragEnd
      }
    }),
    [mode, side, setMode, handleDragDown, handleDragMove, handleDragEnd]
  );

  const floatingStyle =
    mode === 'floating'
      ? {
          width: size.width,
          height: size.height,
          ...(position
            ? {
                left: position.x,
                top: position.y,
                right: 'auto',
                bottom: 'auto'
              }
            : null)
        }
      : null;

  return (
    <aside
      ref={node => {
        panelRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={cx(styles.root, className)}
      data-mode={mode}
      data-side={side}
      data-dragging={dragging || undefined}
      data-resizing={resizing || undefined}
      style={{ ...floatingStyle, ...style }}
      {...props}
    >
      <ChatPanelContext.Provider value={contextValue}>
        {children}
        {mode === 'floating' &&
          RESIZE_DIRECTIONS.map(direction => (
            <div
              key={direction}
              aria-hidden='true'
              className={cx(
                styles['resize-handle'],
                styles[`resize-${direction}`]
              )}
              onPointerDown={handleResizeDown(direction)}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeEnd}
              onPointerCancel={handleResizeEnd}
            />
          ))}
      </ChatPanelContext.Provider>
    </aside>
  );
}

ChatPanelRoot.displayName = 'ChatPanel';
