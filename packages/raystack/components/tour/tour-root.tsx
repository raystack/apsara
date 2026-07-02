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
import { rectsEqual, TourOverlay } from './tour-overlay';
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

/**
 * How long the previous step's cutout is given to fade out before the next
 * step is revealed (fade mode). Matches the overlay's opacity transition in
 * `tour.module.css`, so the reposition lands while the overlay is transparent.
 */
const FADE_OUT_MS = 160;

/**
 * Safety net for the reveal gate: if a step's target never settles into view —
 * it may never mount (a spotlight-only step whose element is absent), be larger
 * than the viewport, or animate continuously — reveal the step anyway after
 * this long so the tour can never hard-hang waiting on it.
 */
const REVEAL_TIMEOUT_MS = 2000;

/**
 * Whether `el` is visible in the viewport *and* within every scrollable
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
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // Fully within the viewport, or — for a target larger than the viewport —
  // currently spanning it (edges past both sides). Without the span case an
  // oversized target (a full-height panel) could never read as "in view", so
  // the reveal loop would spin until its timeout instead of settling promptly.
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

  // A detached step (welcome/finish) has no anchor and no spotlight; it is
  // "revealed" as soon as it is running, since there is no target to wait for.
  const detachedStep =
    step != null && step.target == null && step.spotlightTarget == null;

  // `revealed` gates the fade-in of the spotlight (always) and of the popover
  // in `fade` mode: they appear only once the active step's target has scrolled
  // into view and its rect has stopped moving, so the spotlight never fades in
  // at a position it is about to leave. (In `move` mode the popover ignores
  // this and glides instead — but the spotlight still cross-fades on it.)
  //
  // On a step-to-step change it also holds off for a grace period so the
  // previous step's cutout can finish fading out before the next one lands. The
  // very first step after opening has nothing to fade out, so it skips the
  // grace, as does reduced motion (no fade to wait for).
  const reducedMotion = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const shownOnceRef = useRef(false);

  // Reset the reveal the instant the target changes — in render, not an effect
  // — so the overlay never sees a stale `revealed` from the previous step for a
  // frame (which would let it adopt the new target before the old hole has
  // faded out, snapping the cutout across the screen). This is the standard
  // "adjust state when a prop changes" pattern; the ref guards the re-render.
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
      // No target to settle on — reveal at once (the dim has no cutout).
      setRevealed(true);
      shownOnceRef.current = true;
      return;
    }
    // Poll with a frame loop until the target is in view, its rect settles for
    // two consecutive frames, and the fade-out grace has elapsed; then reveal
    // once and stop — no per-frame re-render after that. A max-wait fallback
    // reveals anyway if the target never settles: it may never mount (a
    // spotlight-only step whose element is absent — `el` stays null), be larger
    // than the viewport, or animate continuously. Without it the tour would
    // hard-hang here with nothing on screen and no way to advance.
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
    // `spotlightElement` identity changes on every step change (and toggles when
    // a target resolves/unmounts), so it — with `popoverOpen` — re-keys the loop
    // per step; `step` is omitted since callers often rebuild the steps array.
  }, [popoverOpen, detachedStep, spotlightElement, reducedMotion]);

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
    el.scrollIntoView({
      block: 'center',
      inline: 'nearest',
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
    // `anchor` is intentionally in the deps: a late-resolving target should
    // scroll into view the moment it lands, not only on index change.
  }, [popoverOpen, step, anchor, reducedMotion]);

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
