'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Measures a DOM element's height and keeps it up to date via `ResizeObserver`.
 * Returns a ref callback to attach to the element, plus the latest height.
 *
 * Used by the List renderer to track the column-header row's height so sticky
 * group headers and the sticky-group anchor can position themselves directly
 * underneath it, regardless of variant, custom header content, or hidden
 * headers.
 */
export function useElementHeight() {
  const [height, setHeight] = useState(0);
  const observerRef = useRef<ResizeObserver | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  const ref = useCallback(
    (el: HTMLElement | null) => {
      cleanup();
      elementRef.current = el;
      if (!el) {
        setHeight(0);
        return;
      }
      setHeight(el.getBoundingClientRect().height);
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(entries => {
        const entry = entries[0];
        if (!entry) return;
        const next = entry.contentRect.height;
        setHeight(prev => (Math.abs(prev - next) < 0.5 ? prev : next));
      });
      observer.observe(el);
      observerRef.current = observer;
    },
    [cleanup]
  );

  useEffect(() => cleanup, [cleanup]);

  return [ref, height] as const;
}
