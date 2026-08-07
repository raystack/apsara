'use client';

import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import { cx } from 'class-variance-authority';
import {
  ComponentProps,
  MouseEvent,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { ArrowDownIcon } from '~/icons/generated';
import { ScrollAreaScrollbar } from '../scroll-area/scroll-area-scrollbar';
import { usePrefersReducedMotion } from '../tour/use-prefers-reduced-motion';
import styles from './chat.module.css';
import {
  ChatMessageRegistration,
  ChatMessagesActions,
  ChatMessagesActionsContext,
  ChatMessagesRegistry,
  ChatMessagesRegistryContext,
  ChatMessagesState,
  ChatMessagesStateContext,
  useChatMessagesActions,
  useChatMessagesState
} from './chat-context';

export interface ChatMessagesProps extends ComponentProps<'div'> {
  /**
   * Distance from the bottom, in pixels, within which the reader still
   * counts as being at the live edge.
   * @defaultValue 24
   */
  bottomThreshold?: number;
  /**
   * Gap kept between the viewport top and a message anchored by
   * `scrollAnchor` or scrolled to with `scrollToMessage`, in pixels.
   * @defaultValue 12
   */
  anchorOffset?: number;
  /**
   * Whether to follow new content while the reader is at the live edge.
   * @defaultValue true
   */
  autoScroll?: boolean;
  /** A ref populated with the imperative scroll commands. */
  actionsRef?: RefObject<ChatMessagesActions | null>;
  /**
   * Accessible label for the message log.
   * @defaultValue "Conversation"
   */
  'aria-label'?: string;
}

interface PendingAnchor {
  element: HTMLElement;
}

export function ChatMessages({
  className,
  children,
  bottomThreshold = 24,
  anchorOffset = 12,
  autoScroll = true,
  actionsRef,
  'aria-label': ariaLabel = 'Conversation',
  ...props
}: ChatMessagesProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [atBottom, setAtBottomState] = useState(true);
  const atBottomRef = useRef(true);
  const followingRef = useRef(true);
  const autoScrollRef = useRef(autoScroll);
  autoScrollRef.current = autoScroll;
  const bottomThresholdRef = useRef(bottomThreshold);
  bottomThresholdRef.current = bottomThreshold;
  const anchorOffsetRef = useRef(anchorOffset);
  anchorOffsetRef.current = anchorOffset;

  const [visibleMessageIds, setVisibleMessageIds] = useState<string[]>([]);
  const [spacerHeight, setSpacerHeight] = useState(0);
  const spacerHeightRef = useRef(0);
  const anchorShrinkRef = useRef<{
    rawAtAnchor: number;
    spacerAtAnchor: number;
  } | null>(null);

  const registryMapRef = useRef(new Map<string, HTMLElement>());
  const visibleSetRef = useRef(new Set<string>());
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  const mountedRef = useRef(false);
  const pendingAnchorRef = useRef<PendingAnchor | null>(null);
  const [anchorTick, setAnchorTick] = useState(0);
  const prevFirstRef = useRef<{ element: Element; top: number } | null>(null);
  const scrollingToBottomRef = useRef(false);

  const reducedMotion = usePrefersReducedMotion();
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const setAtBottom = useCallback((next: boolean) => {
    if (atBottomRef.current === next) return;
    atBottomRef.current = next;
    setAtBottomState(next);
  }, []);

  const isAtBottom = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return true;
    return (
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <=
      bottomThresholdRef.current
    );
  }, []);

  /** Offset of an element within the viewport's scroll coordinate space. */
  const offsetWithin = useCallback((element: Element) => {
    const viewport = viewportRef.current;
    if (!viewport) return 0;
    return (
      element.getBoundingClientRect().top -
      viewport.getBoundingClientRect().top +
      viewport.scrollTop
    );
  }, []);

  const setSpacer = useCallback((next: number) => {
    if (spacerHeightRef.current === next) return;
    spacerHeightRef.current = next;
    setSpacerHeight(next);
  }, []);

  const scrollViewportTo = useCallback(
    (top: number, behavior: ScrollBehavior) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      if (typeof viewport.scrollTo === 'function') {
        viewport.scrollTo({ top, behavior });
      } else {
        viewport.scrollTop = top;
      }
    },
    []
  );

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      followingRef.current = true;
      const resolved: ScrollBehavior = reducedMotionRef.current
        ? 'auto'
        : behavior;
      if (resolved === 'smooth') scrollingToBottomRef.current = true;
      scrollViewportTo(viewport.scrollHeight, resolved);
      setAtBottom(true);
    },
    [scrollViewportTo, setAtBottom]
  );

  const scrollToMessage = useCallback(
    (id: string, options?: { behavior?: ScrollBehavior }) => {
      const viewport = viewportRef.current;
      const element = registryMapRef.current.get(id);
      if (!viewport || !element) return;
      followingRef.current = false;
      scrollViewportTo(
        Math.max(0, offsetWithin(element) - anchorOffsetRef.current),
        reducedMotionRef.current ? 'auto' : (options?.behavior ?? 'smooth')
      );
    },
    [offsetWithin, scrollViewportTo]
  );

  const updateVisibleIds = useCallback(() => {
    const registry = registryMapRef.current;
    const ids = Array.from(visibleSetRef.current);
    ids.sort((a, b) => {
      const elementA = registry.get(a);
      const elementB = registry.get(b);
      if (!elementA || !elementB) return 0;
      return elementA.compareDocumentPosition(elementB) &
        Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1;
    });
    setVisibleMessageIds(previous =>
      previous.length === ids.length &&
      previous.every((id, index) => id === ids[index])
        ? previous
        : ids
    );
  }, []);

  const register = useCallback(
    (element: HTMLElement, registration: ChatMessageRegistration) => {
      const { id, scrollAnchor } = registration;
      if (id) {
        registryMapRef.current.set(id, element);
        intersectionObserverRef.current?.observe(element);
      }
      if (scrollAnchor && mountedRef.current) {
        // Anchoring pauses following; the reply streams in below while the
        // anchored message holds near the viewport top.
        followingRef.current = false;
        pendingAnchorRef.current = { element };
        const viewport = viewportRef.current;
        if (viewport) {
          const contentEnd = viewport.scrollHeight - spacerHeightRef.current;
          const below = contentEnd - offsetWithin(element);
          const needed = Math.max(
            0,
            Math.round(viewport.clientHeight - anchorOffsetRef.current - below)
          );
          anchorShrinkRef.current = {
            rawAtAnchor: contentEnd,
            spacerAtAnchor: needed
          };
          setSpacer(needed);
        }
        setAnchorTick(tick => tick + 1);
      }
      return () => {
        if (id) {
          if (registryMapRef.current.get(id) === element) {
            registryMapRef.current.delete(id);
          }
          intersectionObserverRef.current?.unobserve(element);
          if (visibleSetRef.current.delete(id)) updateVisibleIds();
        }
      };
    },
    [offsetWithin, setSpacer, updateVisibleIds]
  );

  // Perform the pending anchor scroll after the spacer has been committed,
  // so the target position exists before the frame paints.
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on anchorTick — each anchor request bumps it.
  useLayoutEffect(() => {
    const pending = pendingAnchorRef.current;
    const viewport = viewportRef.current;
    if (!pending || !viewport) return;
    pendingAnchorRef.current = null;
    if (!pending.element.isConnected) return;
    viewport.scrollTop = Math.max(
      0,
      offsetWithin(pending.element) - anchorOffsetRef.current
    );
    setAtBottom(isAtBottom());
  }, [anchorTick, offsetWithin, isAtBottom, setAtBottom]);

  // Start pinned to the live edge.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) viewport.scrollTop = viewport.scrollHeight;
    mountedRef.current = true;
  }, []);

  // Keep the reading position stable when history is prepended above.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;
    let first = content.firstElementChild;
    while (first && first.hasAttribute('data-chat-jump-button')) {
      first = first.nextElementSibling;
    }
    const previous = prevFirstRef.current;
    if (
      previous &&
      previous.element.isConnected &&
      first !== previous.element &&
      !atBottomRef.current
    ) {
      const delta = offsetWithin(previous.element) - previous.top;
      if (delta > 0) viewport.scrollTop += delta;
    }
    prevFirstRef.current = first
      ? { element: first, top: offsetWithin(first) }
      : null;
  });

  // Scroll tracking: keep atBottom fresh and treat user scrolls as intent to
  // follow (at bottom) or stop following (scrolled up).
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const handleScroll = () => {
      const bottom = isAtBottom();
      setAtBottom(bottom);
      if (scrollingToBottomRef.current) {
        if (bottom) scrollingToBottomRef.current = false;
        return;
      }
      followingRef.current = bottom;
    };
    viewport.addEventListener('scroll', handleScroll, { passive: true });
    return () => viewport.removeEventListener('scroll', handleScroll);
  }, [isAtBottom, setAtBottom]);

  // Follow growth while at the live edge; consume the anchor spacer as the
  // reply streams into it so the blank space fills up instead of lingering.
  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content || typeof ResizeObserver === 'undefined') return;
    const resizeObserver = new ResizeObserver(() => {
      const shrink = anchorShrinkRef.current;
      if (shrink) {
        const raw = content.offsetHeight - spacerHeightRef.current;
        const next = Math.max(
          0,
          shrink.spacerAtAnchor - (raw - shrink.rawAtAnchor)
        );
        setSpacer(next);
        if (next === 0) anchorShrinkRef.current = null;
      }
      if (autoScrollRef.current && followingRef.current) {
        viewport.scrollTop = viewport.scrollHeight;
        setAtBottom(true);
      } else {
        setAtBottom(isAtBottom());
      }
    });
    resizeObserver.observe(content);
    resizeObserver.observe(viewport);
    return () => resizeObserver.disconnect();
  }, [isAtBottom, setAtBottom, setSpacer]);

  // Track which registered messages intersect the viewport.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || typeof IntersectionObserver === 'undefined') return;
    const idOf = (element: Element) =>
      element.getAttribute('data-message-id') ?? undefined;
    const intersectionObserver = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const id = idOf(entry.target);
          if (!id) continue;
          if (entry.isIntersecting) visibleSetRef.current.add(id);
          else visibleSetRef.current.delete(id);
        }
        updateVisibleIds();
      },
      { root: viewport, threshold: 0 }
    );
    intersectionObserverRef.current = intersectionObserver;
    for (const element of registryMapRef.current.values()) {
      intersectionObserver.observe(element);
    }
    return () => {
      intersectionObserver.disconnect();
      intersectionObserverRef.current = null;
    };
  }, [updateVisibleIds]);

  const actions = useMemo<ChatMessagesActions>(
    () => ({ scrollToBottom, scrollToMessage }),
    [scrollToBottom, scrollToMessage]
  );

  useImperativeHandle(actionsRef, () => actions, [actions]);

  const state = useMemo<ChatMessagesState>(
    () => ({ atBottom, visibleMessageIds }),
    [atBottom, visibleMessageIds]
  );

  const registry = useMemo<ChatMessagesRegistry>(
    () => ({ register }),
    [register]
  );

  return (
    <ChatMessagesRegistryContext.Provider value={registry}>
      <ChatMessagesActionsContext.Provider value={actions}>
        <ChatMessagesStateContext.Provider value={state}>
          <ScrollAreaPrimitive.Root
            className={cx(styles.messages, className)}
            {...props}
          >
            <ScrollAreaPrimitive.Viewport
              ref={viewportRef}
              className={styles['messages-viewport']}
              role='log'
              aria-label={ariaLabel}
            >
              <ScrollAreaPrimitive.Content
                ref={contentRef}
                className={styles['messages-content']}
              >
                {children}
                {spacerHeight > 0 && (
                  <div
                    className={styles['messages-spacer']}
                    style={{ height: spacerHeight }}
                    aria-hidden='true'
                  />
                )}
              </ScrollAreaPrimitive.Content>
            </ScrollAreaPrimitive.Viewport>
            <ScrollAreaScrollbar orientation='vertical' type='hover' />
          </ScrollAreaPrimitive.Root>
        </ChatMessagesStateContext.Provider>
      </ChatMessagesActionsContext.Provider>
    </ChatMessagesRegistryContext.Provider>
  );
}

ChatMessages.displayName = 'Chat.Messages';

export interface ChatJumpButtonProps extends ComponentProps<'button'> {
  /**
   * Icon rendered before the label. Pass `null` to remove it.
   * @defaultValue an arrow-down icon
   */
  leadingIcon?: ReactNode;
}

export function ChatJumpButton({
  className,
  children,
  onClick,
  leadingIcon,
  ...props
}: ChatJumpButtonProps) {
  const { atBottom } = useChatMessagesState('Chat.JumpButton');
  const { scrollToBottom } = useChatMessagesActions('Chat.JumpButton');

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    scrollToBottom('smooth');
  };

  return (
    <button
      type='button'
      data-chat-jump-button=''
      data-active={!atBottom || undefined}
      tabIndex={atBottom ? -1 : 0}
      aria-hidden={atBottom || undefined}
      className={cx(styles['jump-button'], className)}
      onClick={handleClick}
      {...props}
    >
      {leadingIcon !== null && (
        <span className={styles['jump-icon']} aria-hidden='true'>
          {leadingIcon ?? <ArrowDownIcon />}
        </span>
      )}
      {children ?? 'Latest'}
    </button>
  );
}

ChatJumpButton.displayName = 'Chat.JumpButton';
