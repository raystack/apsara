'use client';

import { useControlled } from '@base-ui/utils/useControlled';
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  type Modifier,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { cx } from 'class-variance-authority';
import {
  ComponentProps,
  CSSProperties,
  ReactNode,
  PointerEvent as ReactPointerEvent,
  RefObject,
  useCallback,
  useEffect,
  useId,
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

/** An element (or ref to one) that confines floating-window dragging. */
export type ChatPanelDragBoundary = HTMLElement | RefObject<HTMLElement | null>;

/** Keep at least this much of the header on screen while clamping. */
const HEADER_SAFE_PX = 48;

const DEFAULT_SIZE: ChatPanelSize = { width: 400, height: 560 };
const DEFAULT_MIN_SIZE: ChatPanelSize = { width: 280, height: 320 };

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

/** Which resize handles to render, mirroring the CSS `resize` vocabulary. */
export type ChatPanelResize = 'both' | 'horizontal' | 'vertical' | 'none';

const RESIZE_HANDLES: Record<ChatPanelResize, ResizeDirection[]> = {
  both: ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'],
  horizontal: ['e', 'w'],
  vertical: ['n', 's'],
  none: []
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

interface DragBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

function resolveDragBoundary(
  boundary: ChatPanelDragBoundary | undefined
): HTMLElement | null {
  if (!boundary) return null;
  return 'current' in boundary ? boundary.current : boundary;
}

/**
 * A PointerSensor that never starts a drag from interactive children. The
 * minimized bubble is the one draggable button: its listeners are only
 * attached while its drag is enabled, so allowing it here is safe.
 */
class ChatPanelPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({ nativeEvent: event }: ReactPointerEvent) => {
        if (event.button !== 0 || event.isPrimary === false) return false;
        const target = event.target as Element;
        if (target.closest('[data-chat-panel-trigger]')) return true;
        return !target.closest(
          'button, a, input, textarea, select, [data-chat-panel-no-drag]'
        );
      }
    }
  ];
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
  resize?: ChatPanelResize;
  /**
   * Whether the floating window can be dragged by its header. Shadows the
   * (useless here) native `draggable` attribute.
   * @defaultValue true
   */
  draggable?: boolean;
  /**
   * Confines floating-window dragging to an element instead of the
   * viewport. Accepts the element or a ref to it.
   */
  dragBoundary?: ChatPanelDragBoundary;
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
  resize = 'both',
  draggable = true,
  dragBoundary,
  ref,
  ...props
}: ChatPanelRootProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  const bubbleElementRef = useRef<HTMLElement | null>(null);
  const draggableId = useId();
  const bubbleDraggableId = useId();

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

  const [resizing, setResizing] = useState(false);
  // Where the minimized bubble was dropped; internal only, survives
  // minimize/restore cycles because it lives here rather than in the trigger.
  const [bubblePosition, setBubblePosition] =
    useState<ChatPanelPosition | null>(null);

  // The size the window first resolved to; the default maxSize, so a custom
  // defaultSize never contradicts its own max.
  const initialSizeRef = useRef(sizeProp ?? defaultSize ?? DEFAULT_SIZE);

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
  const maxSizeRef = useRef(maxSize ?? initialSizeRef.current);
  maxSizeRef.current = maxSize ?? initialSizeRef.current;
  const dragBoundaryRef = useRef(dragBoundary);
  dragBoundaryRef.current = dragBoundary;

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

  const getDragBounds = useCallback((): DragBounds => {
    const element = resolveDragBoundary(dragBoundaryRef.current);
    if (element) {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom
      };
    }
    return {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight
    };
  }, []);

  const clampPosition = useCallback(
    (next: ChatPanelPosition, width: number): ChatPanelPosition => {
      const bounds = getDragBounds();
      return {
        x: Math.round(clamp(next.x, bounds.left, bounds.right - width)),
        y: Math.round(clamp(next.y, bounds.top, bounds.bottom - HEADER_SAFE_PX))
      };
    },
    [getDragBounds]
  );

  /* ------------------------------- dragging ------------------------------ */

  // The distance constraint keeps bubble clicks working: a press that moves
  // less than 4px stays a click and never activates a drag.
  const sensors = useSensors(
    useSensor(ChatPanelPointerSensor, {
      activationConstraint: { distance: 4 }
    })
  );

  // Clamps the live drag transform the same way the committed position is
  // clamped: fully inside the bounds horizontally, header kept reachable
  // vertically. The bubble is small, so it stays fully on screen instead.
  const restrictToDragBounds = useCallback<Modifier>(
    ({ transform, draggingNodeRect, active }) => {
      if (!draggingNodeRect) return transform;
      if (active?.id === bubbleDraggableId) {
        return {
          ...transform,
          x: clamp(
            transform.x,
            -draggingNodeRect.left,
            window.innerWidth - draggingNodeRect.left - draggingNodeRect.width
          ),
          y: clamp(
            transform.y,
            -draggingNodeRect.top,
            window.innerHeight - draggingNodeRect.top - draggingNodeRect.height
          )
        };
      }
      const bounds = getDragBounds();
      return {
        ...transform,
        x: clamp(
          transform.x,
          bounds.left - draggingNodeRect.left,
          bounds.right - draggingNodeRect.left - draggingNodeRect.width
        ),
        y: clamp(
          transform.y,
          bounds.top - draggingNodeRect.top,
          bounds.bottom - HEADER_SAFE_PX - draggingNodeRect.top
        )
      };
    },
    [getDragBounds, bubbleDraggableId]
  );
  const modifiers = useMemo(
    () => [restrictToDragBounds],
    [restrictToDragBounds]
  );

  const dragOriginRef = useRef<{ x: number; y: number; width: number } | null>(
    null
  );
  const bubbleDragOriginRef = useRef<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      if (event.active.id === bubbleDraggableId) {
        const bubble = bubbleElementRef.current;
        if (!bubble) return;
        const rect = bubble.getBoundingClientRect();
        bubbleDragOriginRef.current = {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        };
        return;
      }
      const panel = panelRef.current;
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      dragOriginRef.current = { x: rect.left, y: rect.top, width: rect.width };
      // Anchor a corner-positioned panel so the drag delta has a fixed origin.
      if (!positionRef.current) {
        setPosition({ x: Math.round(rect.left), y: Math.round(rect.top) });
      }
    },
    [setPosition, bubbleDraggableId]
  );

  // dnd-kit's end delta is the raw translate (modifiers are not applied to
  // it), so the commit re-clamps with the same bounds as the modifier.
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (event.active.id === bubbleDraggableId) {
        const origin = bubbleDragOriginRef.current;
        bubbleDragOriginRef.current = null;
        if (!origin) return;
        setBubblePosition({
          x: Math.round(
            clamp(origin.x + event.delta.x, 0, window.innerWidth - origin.width)
          ),
          y: Math.round(
            clamp(
              origin.y + event.delta.y,
              0,
              window.innerHeight - origin.height
            )
          )
        });
        return;
      }
      const origin = dragOriginRef.current;
      dragOriginRef.current = null;
      if (!origin) return;
      setPosition(
        clampPosition(
          { x: origin.x + event.delta.x, y: origin.y + event.delta.y },
          origin.width
        )
      );
    },
    [clampPosition, setPosition, bubbleDraggableId]
  );

  const handleDragCancel = useCallback(() => {
    dragOriginRef.current = null;
    bubbleDragOriginRef.current = null;
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

  // Keep a dropped bubble reachable too: unlike the floating window it has
  // no header to grab, so an off-screen bubble would strand the panel. Runs
  // on entering minimized as well, covering resizes made in other modes.
  useEffect(() => {
    if (mode !== 'minimized' || typeof window === 'undefined') return;
    const clampBubble = () => {
      setBubblePosition(current => {
        if (!current) return current;
        const rect = bubbleElementRef.current?.getBoundingClientRect();
        const next = {
          x: Math.round(
            clamp(current.x, 0, window.innerWidth - (rect?.width ?? 0))
          ),
          y: Math.round(
            clamp(current.y, 0, window.innerHeight - (rect?.height ?? 0))
          )
        };
        return next.x === current.x && next.y === current.y ? current : next;
      });
    };
    clampBubble();
    window.addEventListener('resize', clampBubble);
    return () => window.removeEventListener('resize', clampBubble);
  }, [mode]);

  const baseContext = useMemo(
    () => ({
      mode,
      side,
      setMode,
      minimize: () => setMode('minimized'),
      restore: () => setMode(previousModeRef.current),
      toggleFloating: () =>
        setMode(modeRef.current === 'floating' ? 'docked' : 'floating'),
      bubbleDraggableId,
      bubbleElementRef
    }),
    [mode, side, setMode, bubbleDraggableId]
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
      : mode === 'minimized' && bubblePosition
        ? {
            // A dropped bubble overrides the CSS corner pinning.
            left: bubblePosition.x,
            top: bubblePosition.y,
            right: 'auto',
            bottom: 'auto'
          }
        : null;

  return (
    <DndContext
      sensors={sensors}
      modifiers={modifiers}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      autoScroll={false}
    >
      <ChatPanelFrame
        draggableId={draggableId}
        baseContext={baseContext}
        panelRef={panelRef}
        mode={mode}
        side={side}
        draggable={draggable}
        resizing={resizing}
        floatingStyle={floatingStyle}
        className={className}
        style={style}
        ref={ref}
        resizeHandles={
          mode === 'floating'
            ? RESIZE_HANDLES[resize].map(direction => (
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
              ))
            : null
        }
        {...props}
      >
        {children}
      </ChatPanelFrame>
    </DndContext>
  );
}

ChatPanelRoot.displayName = 'ChatPanel';

interface ChatPanelFrameProps extends ComponentProps<'aside'> {
  draggableId: string;
  baseContext: Omit<ChatPanelContextValue, 'dragHandleRef' | 'dragListeners'>;
  panelRef: RefObject<HTMLElement | null>;
  mode: ChatPanelMode;
  side: ChatPanelSide;
  draggable: boolean;
  resizing: boolean;
  floatingStyle: CSSProperties | null;
  resizeHandles: ReactNode;
}

// useDraggable needs the DndContext provider above it, so the frame lives in
// its own component under the root's DndContext.
function ChatPanelFrame({
  draggableId,
  baseContext,
  panelRef,
  mode,
  side,
  draggable,
  resizing,
  floatingStyle,
  resizeHandles,
  className,
  style,
  children,
  ref,
  ...props
}: ChatPanelFrameProps) {
  const dragEnabled = mode === 'floating' && draggable;
  const { setNodeRef, setActivatorNodeRef, listeners, transform, isDragging } =
    useDraggable({
      id: draggableId,
      disabled: !dragEnabled
    });

  const contextValue = useMemo<ChatPanelContextValue>(
    () => ({
      ...baseContext,
      dragHandleRef: setActivatorNodeRef,
      dragListeners: listeners
    }),
    [baseContext, setActivatorNodeRef, listeners]
  );

  return (
    <aside
      ref={node => {
        panelRef.current = node;
        setNodeRef(node);
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={cx(styles.root, className)}
      data-mode={mode}
      data-side={side}
      data-draggable={dragEnabled || undefined}
      data-dragging={isDragging || undefined}
      data-resizing={resizing || undefined}
      style={{
        ...floatingStyle,
        // The committed position only updates when the drag ends; the live
        // movement is the dnd-kit transform.
        ...(transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : null),
        ...style
      }}
      {...props}
    >
      <ChatPanelContext.Provider value={contextValue}>
        {children}
        {resizeHandles}
      </ChatPanelContext.Provider>
    </aside>
  );
}
