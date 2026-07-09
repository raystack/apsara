'use client';

import { useControlled } from '@base-ui/utils/useControlled';
import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import { TourContent } from './tour-content';
import { TourContext, type TourContextValue } from './tour-context';
import { TourOverlay } from './tour-overlay';
import type {
  TourActions,
  TourEndStatus,
  TourEvent,
  TourStatus,
  TourStep,
  TourTransition
} from './types';
import { usePrefersReducedMotion } from './use-prefers-reduced-motion';
import { resolveTourTarget, useTourTarget } from './use-tour-target';
import { rectsEqual } from './utils';

// Must match the overlay's opacity transition in `tour.module.css`.
const FADE_OUT_MS = 160;

const REVEAL_TIMEOUT_MS = 2000;

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
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // The second clause handles an oversized target spanning the viewport.
  const inViewY =
    (rect.top >= 0 && rect.bottom <= vh) ||
    (rect.height > vh && rect.top <= 0 && rect.bottom >= vh);
  const inViewX =
    (rect.left >= 0 && rect.right <= vw) ||
    (rect.width > vw && rect.left <= 0 && rect.right >= vw);
  return inViewX && inViewY;
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
  /**
   * Active step index (controlled). Keep it within `0..steps.length - 1`: the
   * tour clamps out-of-range values internally for rendering but never writes
   * the clamped value back, so a controlled parent must not hold one out of
   * range (its `next`/`prev`/`go` operate on the clamped index).
   */
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
   * How the popover card travels between steps. `fade` (default) cross-fades it
   * at each target; `move` glides it smoothly from one target to the next. The
   * spotlight always cross-fades regardless — it never slides. @default 'fade'
   */
  transition?: TourTransition;
  /**
   * Hide the dimmed overlay for the whole tour — only the popover is shown and
   * the page stays fully interactive. Steps can override with
   * `step.disableOverlay`. @default false
   */
  disableOverlay?: boolean;
  /**
   * Tour UI. Defaults to `<Tour.Overlay />` plus `<Tour.Content />` with the
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
  transition = 'fade',
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on open/index, not `step` — inline steps arrays give function targets a fresh identity each render.
  const target = useMemo(
    () => (open ? step?.target : undefined),
    [open, index]
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on open/index, not `step`.
  const spotlightTarget = useMemo(
    () => (open ? step?.spotlightTarget : undefined),
    [open, index]
  );

  const { element: anchor, state: targetState } = useTourTarget(target, {
    enabled: open && step != null,
    timeout: targetTimeout,
    onNotFound: handleTargetNotFound
  });
  const { element: spotlightOverride } = useTourTarget(spotlightTarget, {
    enabled: open && spotlightTarget != null,
    timeout: targetTimeout
  });
  const spotlightElement = spotlightOverride ?? anchor;

  const popoverOpen = open && step != null && targetState === 'found';
  const status: TourStatus = !open
    ? 'idle'
    : targetState === 'found'
      ? 'running'
      : 'waiting';

  const detachedStep =
    step != null && step.target == null && step.spotlightTarget == null;

  const reducedMotion = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const shownOnceRef = useRef(false);

  // Reset in render (not an effect) so the overlay never sees a stale `revealed`
  // for a frame; the ref guards against a re-render loop.
  const revealedForRef = useRef(spotlightElement);
  if (revealedForRef.current !== spotlightElement) {
    revealedForRef.current = spotlightElement;
    if (revealed) setRevealed(false);
  }

  useEffect(() => {
    if (!popoverOpen) {
      setRevealed(false);
      shownOnceRef.current = false;
      return;
    }
    if (detachedStep) {
      setRevealed(true);
      shownOnceRef.current = true;
      return;
    }
    // The fallback reveal is a safety net so a target that never settles can't
    // hang the tour.
    setRevealed(false);
    const el = spotlightElement;
    const grace = shownOnceRef.current && !reducedMotion ? FADE_OUT_MS : 0;
    const start = performance.now();
    let frame = 0;
    let fallback: ReturnType<typeof setTimeout>;
    let stable = 0;
    let last: DOMRect | null = null;
    let settled = false;
    const reveal = () => {
      if (settled) return;
      settled = true;
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
      setRevealed(true);
      shownOnceRef.current = true;
    };
    const check = () => {
      if (el?.isConnected && isElementInView(el)) {
        const next = el.getBoundingClientRect();
        if (last && rectsEqual(last, next)) {
          stable += 1;
        } else {
          stable = 0;
        }
        last = next;
        if (stable >= 2 && performance.now() - start >= grace) {
          reveal();
          return;
        }
      } else {
        stable = 0;
      }
      frame = requestAnimationFrame(check);
    };
    fallback = setTimeout(reveal, REVEAL_TIMEOUT_MS);
    frame = requestAnimationFrame(check);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
    };
  }, [popoverOpen, detachedStep, spotlightElement, reducedMotion]);

  // Starts false so a tour mounted already-open still emits `tour:start`.
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on `index`, not `step` — the per-render `step` identity would re-fire this and fight the user's scroll.
  useEffect(() => {
    if (!popoverOpen || !step || step.disableScroll) return;
    const el = resolveTourTarget(step.scrollTarget) ?? anchor;
    if (!el?.isConnected) return;
    if (isElementInView(el)) return;
    el.scrollIntoView({
      block: 'center',
      inline: 'nearest',
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  }, [popoverOpen, index, anchor, reducedMotion]);

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
      transition,
      revealed,
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
      transition,
      revealed,
      actions
    ]
  );

  return (
    <TourContext.Provider value={contextValue}>
      {children ?? (
        <>
          <TourOverlay />
          <TourContent />
        </>
      )}
    </TourContext.Provider>
  );
}

TourRoot.displayName = 'Tour';
