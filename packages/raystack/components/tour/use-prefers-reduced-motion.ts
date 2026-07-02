'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks the user's `prefers-reduced-motion` setting, updating if it changes.
 * Defaults to motion-allowed (`false`) on the server and where `matchMedia`
 * is unavailable, so the tour's fade/glide logic degrades to instant swaps for
 * reduced-motion users without any layout-affecting difference on the server.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return;
    }
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  return reduced;
}
