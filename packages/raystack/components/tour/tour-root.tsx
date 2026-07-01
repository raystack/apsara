'use client';

import { useControlled } from '@base-ui/utils/useControlled';
import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react';
import { TourContext, type TourContextValue } from './tour-context';
import { TourOverlay } from './tour-overlay';
import { TourPopover } from './tour-popover';
import type {
  TourActions,
  TourEndStatus,
  TourEvent,
  TourStatus,
  TourStep
} from './types';
import { resolveTourTarget, useTourTarget } from './use-tour-target';

/**
 * Whether `el` is fully visible in the viewport *and* within every scrollable
 * ancestor. The ancestor check matters: an element scrolled out of a nested
 * `overflow: auto` container can still sit within the window's bounds, so a
 * viewport-only test would wrongly skip scrolling it into view.
 */
function isElementInView(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  let node = el.parentElement;
  while (node && node !== document.documentElement) {
    const { overflowX, overflowY } = getComputedStyle(node);
    const scrollable = /(auto|scroll|overlay)/.test(overflowX + overflowY);
    if (scrollable) {
      const bounds = node.getBoundingClientRect();
      if (
        rect.top < bounds.top ||
        rect.bottom > bounds.bottom ||
        rect.left < bounds.left ||
        rect.right > bounds.right
      ) {
        return false;
      }
    }
    node = node.parentElement;
  }
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}

export interface TourRootProps {
  /** Ordered list of steps that make up the tour. */
  steps: TourStep[];
  /** Whether the tour is currently open (controlled). */
  open?: boolean;
  /** Whether the tour is initially open. @default false */
  defaultOpen?: boolean;
  /** Called when the tour opens or closes. `status` is set when closing. */
  onOpenChange?: (open: boolean, details: { status?: TourEndStatus }) => void;
  /** Active step index (controlled). */
  stepIndex?: number;
  /** Initially active step when uncontrolled. @default 0 */
  defaultStepIndex?: number;
  /** Called when the active step changes. */
  onStepChange?: (index: number, step: TourStep) => void;
  /** Receives every tour lifecycle event. */
  onEvent?: (event: TourEvent) => void;
  /** A ref populated with the imperative tour controls. */
  actionsRef?: RefObject<TourActions | null>;
  /**
   * How long to wait for a step target to appear in the DOM before giving
   * up, in ms. @default 5000
   */
  targetTimeout?: number;
  /**
   * What to do when a step target cannot be found: skip to the next step or
   * stop the tour. Emits `error:target-not-found` either way.
   * @default 'skip'
   */
  targetNotFound?: 'skip' | 'stop';
  /**
   * Hide the dimmed overlay for the whole tour — only the popover is shown and
   * the page stays fully interactive. Steps can override with
   * `step.disableOverlay`. @default false
   */
  disableOverlay?: boolean;
  /**
   * Tour UI. Defaults to `<Tour.Overlay />` plus `<Tour.Popover />` with the
   * standard card layout; compose the parts to customize.
   */
  children?: ReactNode;
}

export function TourRoot({
  steps,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  stepIndex: stepIndexProp,
  defaultStepIndex = 0,
  onStepChange,
  onEvent,
  actionsRef,
  targetTimeout = 5000,
  targetNotFound = 'skip',
  disableOverlay = false,
  children
}: TourRootProps) {
  const [open, setOpenUnwrapped] = useControlled({
    controlled: openProp,
    default: defaultOpen,
    name: 'Tour',
    state: 'open'
  });
  const [indexUnclamped, setIndexUnwrapped] = useControlled({
    controlled: stepIndexProp,
    default: defaultStepIndex,
    name: 'Tour',
    state: 'stepIndex'
  });
  const index = Math.min(
    Math.max(indexUnclamped, 0),
    Math.max(steps.length - 1, 0)
  );
  const step = open ? (steps[index] ?? null) : null;

  // Latest-value refs keep `actions` referentially stable across renders.
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const indexRef = useRef(index);
  indexRef.current = index;
  const openRef = useRef(open);
  openRef.current = open;
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const onStepChangeRef = useRef(onStepChange);
  onStepChangeRef.current = onStepChange;
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;
  const targetNotFoundRef = useRef(targetNotFound);
  targetNotFoundRef.current = targetNotFound;
  const endStatusRef = useRef<TourEndStatus>('closed');

  const emit = useCallback(
    (event: TourEvent) => onEventRef.current?.(event),
    []
  );

  const setOpen = useCallback(
    (nextOpen: boolean, status?: TourEndStatus) => {
      if (status) endStatusRef.current = status;
      setOpenUnwrapped(nextOpen);
      onOpenChangeRef.current?.(nextOpen, {
        status: nextOpen ? undefined : endStatusRef.current
      });
    },
    [setOpenUnwrapped]
  );

  const setIndex = useCallback(
    (nextIndex: number) => {
      setIndexUnwrapped(nextIndex);
      onStepChangeRef.current?.(nextIndex, stepsRef.current[nextIndex]);
    },
    [setIndexUnwrapped]
  );

  // Everything except `start` is a no-op while the tour is closed.
  const actions = useMemo<TourActions>(
    () => ({
      start: (at = 0) => {
        const clamped = Math.min(
          Math.max(at, 0),
          Math.max(stepsRef.current.length - 1, 0)
        );
        setIndex(clamped);
        setOpen(true);
      },
      stop: () => {
        if (openRef.current) setOpen(false, 'closed');
      },
      skip: () => {
        if (openRef.current) setOpen(false, 'skipped');
      },
      next: () => {
        if (!openRef.current) return;
        if (indexRef.current >= stepsRef.current.length - 1) {
          setOpen(false, 'finished');
        } else {
          setIndex(indexRef.current + 1);
        }
      },
      prev: () => {
        if (openRef.current && indexRef.current > 0) {
          setIndex(indexRef.current - 1);
        }
      },
      go: at => {
        if (openRef.current && at >= 0 && at < stepsRef.current.length) {
          setIndex(at);
        }
      }
    }),
    [setIndex, setOpen]
  );

  useImperativeHandle(actionsRef, () => actions, [actions]);

  const handleTargetNotFound = useCallback(() => {
    const at = indexRef.current;
    emit({
      type: 'error:target-not-found',
      index: at,
      step: stepsRef.current[at]
    });
    if (
      targetNotFoundRef.current === 'stop' ||
      at >= stepsRef.current.length - 1
    ) {
      setOpen(false, 'closed');
    } else {
      setIndex(at + 1);
    }
  }, [emit, setIndex, setOpen]);

  const { element: anchor, state: targetState } = useTourTarget(step?.target, {
    enabled: open && step != null,
    timeout: targetTimeout,
    onNotFound: handleTargetNotFound
  });
  const { element: spotlightOverride } = useTourTarget(step?.spotlightTarget, {
    enabled: open && step?.spotlightTarget != null,
    timeout: targetTimeout
  });
  const spotlightElement = spotlightOverride ?? anchor;

  const popoverOpen = open && step != null && targetState === 'found';
  const status: TourStatus = !open
    ? 'idle'
    : targetState === 'found'
      ? 'running'
      : 'waiting';

  // Starts false (not `open`) so a tour mounted already-open still emits
  // `tour:start`.
  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (prevOpenRef.current === open) return;
    prevOpenRef.current = open;
    if (open) {
      emit({
        type: 'tour:start',
        index: indexRef.current,
        step: stepsRef.current[indexRef.current]
      });
    } else {
      emit({
        type: 'tour:end',
        index: indexRef.current,
        status: endStatusRef.current
      });
      endStatusRef.current = 'closed';
    }
  }, [open, emit]);

  const lastActiveIndexRef = useRef(-1);
  useEffect(() => {
    if (!open) {
      lastActiveIndexRef.current = -1;
      return;
    }
    if (!popoverOpen || !step || lastActiveIndexRef.current === index) return;
    lastActiveIndexRef.current = index;
    emit({ type: 'step:active', index, step });
  }, [open, popoverOpen, index, step, emit]);

  // Scroll the target into view once, when the step becomes active.
  useEffect(() => {
    if (!popoverOpen || !step || step.disableScroll) return;
    const el = resolveTourTarget(step.scrollTarget) ?? anchor;
    if (!el?.isConnected) return;
    // `isElementInView` also checks scrollable ancestors, so a target clipped
    // inside a nested scroll container counts as hidden and gets revealed.
    if (isElementInView(el)) return;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    el.scrollIntoView({
      block: 'center',
      inline: 'nearest',
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
    // `anchor` is intentionally in the deps: a late-resolving target should
    // scroll into view the moment it lands, not only on index change.
  }, [popoverOpen, step, anchor]);

  const contextValue = useMemo<TourContextValue>(
    () => ({
      steps,
      index,
      step,
      open,
      status,
      anchor,
      spotlightElement,
      popoverOpen,
      disableOverlay,
      actions
    }),
    [
      steps,
      index,
      step,
      open,
      status,
      anchor,
      spotlightElement,
      popoverOpen,
      disableOverlay,
      actions
    ]
  );

  return (
    <TourContext.Provider value={contextValue}>
      {children ?? (
        <>
          <TourOverlay />
          <TourPopover />
        </>
      )}
    </TourContext.Provider>
  );
}

TourRoot.displayName = 'Tour';
