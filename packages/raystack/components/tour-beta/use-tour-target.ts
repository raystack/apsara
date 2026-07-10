'use client';

import { useEffect, useRef, useState } from 'react';
import type { TourTarget } from './types';

export function resolveTourTarget(
  target: TourTarget | null | undefined
): Element | null {
  if (!target || typeof document === 'undefined') return null;
  if (typeof target === 'string') return document.querySelector(target);
  if (typeof target === 'function') return target();
  if (target instanceof Element) return target;
  return target.current;
}

export type TourTargetState = 'idle' | 'resolving' | 'found' | 'not-found';

interface UseTourTargetOptions {
  enabled: boolean;
  /** How long to wait for a missing target before giving up, in ms. */
  timeout: number;
  onNotFound?: () => void;
}

/**
 * Resolves a step target to a live element. Targets not in the DOM yet
 * (lazy content, route transitions) are awaited with a MutationObserver
 * until `timeout` elapses.
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
    if (!target) {
      // Detached step: nothing to resolve, the popover renders centered.
      setElement(null);
      setState('found');
      return;
    }
    const found = resolveTourTarget(target);
    if (found?.isConnected) {
      setElement(found);
      setState('found');
      return;
    }
    setElement(null);
    setState('resolving');
    const observer = new MutationObserver(() => {
      const el = resolveTourTarget(target);
      if (el?.isConnected) {
        observer.disconnect();
        clearTimeout(timer);
        setElement(el);
        setState('found');
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    const timer = setTimeout(() => {
      observer.disconnect();
      setState('not-found');
      onNotFoundRef.current?.();
    }, timeout);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [target, enabled, timeout]);

  return { element, state };
}
