'use client';

import { type RefObject, useCallback, useEffect, useState } from 'react';

import { useIsomorphicLayoutEffect } from '~/hooks';

/**
 * The resolved `--rs-scaling` for a subtree. Both renderers keep geometry in
 * JS — virtualizer estimates, group-header offsets, timeline lane math — which
 * the token-driven CSS around them zooms without. Reading the factor here lets
 * that geometry follow the theme too.
 *
 * 1 on the server and for the first render; the element has to exist before
 * the custom property can be resolved.
 */
export function useScaling(ref: RefObject<HTMLElement | null>): number {
  const [scaling, setScaling] = useState(1);

  const read = useCallback(() => {
    const element = ref.current;
    if (!element) return;
    const next = Number.parseFloat(
      getComputedStyle(element).getPropertyValue('--rs-scaling')
    );
    if (!Number.isFinite(next) || next <= 0) return;
    setScaling(previous => (previous === next ? previous : next));
  }, [ref]);

  useIsomorphicLayoutEffect(read, [read]);

  // A theme anywhere above may change its scaling without re-rendering here.
  useEffect(() => {
    if (typeof MutationObserver === 'undefined') return;
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-scaling']
    });
    return () => observer.disconnect();
  }, [read]);

  return scaling;
}
