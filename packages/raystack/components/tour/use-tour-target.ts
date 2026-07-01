'use client';

import { useEffect, useRef, useState } from 'react';
import type { TourTarget } from './types';

/**
 * Resolve a {@link TourTarget} to a live element. Returns `null` when the
 * target is missing or (for element/ref targets) detached from the document —
 * connectedness is the caller's contract, so this never hands back an orphaned
 * node.
 */
export function resolveTourTarget(
  target: TourTarget | null | undefined
): Element | null {
  if (target == null || typeof document === 'undefined') return null;
  if (typeof target === 'string') {
    try {
      return document.querySelector(target);
    } catch {
      // An invalid selector should degrade to "not found", not throw.
      return null;
    }
  }
  if (typeof target === 'function') return target();
  if (target instanceof Element) return target;
  return target.current ?? null;
}

export type TourTargetState = 'idle' | 'resolving' | 'found';

interface UseTourTargetOptions {
  /** Whether the target should be resolved at all. */
  enabled: boolean;
  /** How long to wait for a missing target before giving up, in ms. */
  timeout: number;
  /** Called once when a target never appears within `timeout`. */
  onNotFound?: () => void;
}

/**
 * Resolves a step target to a connected element and keeps it accurate for the
 * lifetime of the step.
 *
 * - Targets already in the DOM resolve synchronously (`found`).
 * - Targets not mounted yet — lazy content, route transitions, dialog bodies —
 *   are awaited with a `MutationObserver` and resolve the moment they appear.
 * - The observer stays live while `found`, so a target that later unmounts
 *   (its dialog closes, its route unmounts) flips back to `resolving` instead
 *   of leaving a stale, disconnected node behind. This is what prevents an
 *   orphaned spotlight/overlay when the element a step points at disappears.
 * - If a target never appears within `timeout`, `onNotFound` fires once.
 *
 * A detached step (`target == null`) resolves to `{ element: null, state: 'found' }`.
 */
export function useTourTarget(
  target: TourTarget | null | undefined,
  { enabled, timeout, onNotFound }: UseTourTargetOptions
) {
  const [element, setElement] = useState<Element | null>(null);
  const [state, setState] = useState<TourTargetState>('idle');
  const onNotFoundRef = useRef(onNotFound);
  onNotFoundRef.current = onNotFound;

  useEffect(() => {
    if (!enabled) {
      setElement(null);
      setState('idle');
      return;
    }
    if (target == null) {
      // Detached step: nothing to resolve, the popover renders centered.
      setElement(null);
      setState('found');
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const clearTimer = () => {
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }
    };
    const startTimer = () => {
      if (timer !== undefined) return;
      timer = setTimeout(() => {
        timer = undefined;
        onNotFoundRef.current?.();
      }, timeout);
    };

    // Runs on mount and on every batched DOM mutation. Functional setState
    // keeps this free of stale closures and avoids no-op re-renders.
    const reconcile = () => {
      const found = resolveTourTarget(target);
      if (found?.isConnected) {
        clearTimer();
        setElement(prev => (prev === found ? prev : found));
        setState(prev => (prev === 'found' ? prev : 'found'));
      } else {
        setElement(prev => (prev === null ? prev : null));
        setState(prev => (prev === 'resolving' ? prev : 'resolving'));
        startTimer();
      }
    };

    reconcile();

    const observer = new MutationObserver(reconcile);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      // Attribute changes can newly satisfy a selector target; element/ref/fn
      // targets only care about mount/unmount, so skip the extra churn.
      attributes: typeof target === 'string'
    });

    return () => {
      observer.disconnect();
      clearTimer();
    };
  }, [target, enabled, timeout]);

  return { element, state };
}
