'use client';

import { useEffect, useRef, useState } from 'react';
import type { TourTarget } from './types';

export function resolveTourTarget(
  target: TourTarget | null | undefined
): Element | null {
  if (target == null || typeof document === 'undefined') return null;
  if (typeof target === 'string') {
    try {
      return document.querySelector(target);
    } catch {
      return null;
    }
  }
  if (typeof target === 'function') {
    try {
      return target();
    } catch {
      return null;
    }
  }
  if (target instanceof Element) return target.isConnected ? target : null;
  return target.current?.isConnected ? target.current : null;
}

export type TourTargetState = 'idle' | 'resolving' | 'found';

interface UseTourTargetOptions {
  enabled: boolean;
  timeout: number;
  onNotFound?: () => void;
}

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
      // Only selector targets can be newly satisfied by an attribute change.
      attributes: typeof target === 'string'
    });

    return () => {
      observer.disconnect();
      clearTimer();
    };
  }, [target, enabled, timeout]);

  return { element, state };
}
