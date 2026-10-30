'use client';

import { useThemeContextOrNull } from './context';

/**
 * The nearest theme's `scaling` as a number, for geometry a component keeps in
 * JS rather than in CSS: virtualizer estimates, group-header offsets, lane math.
 * 1 outside a `<Theme>`. With a persisted `scaling`, the hydrating render uses
 * the server default and the next render the stored value.
 *
 * Internal: deliberately not exported from `index.tsx`.
 */
export function useScaling(): number {
  return Number(useThemeContextOrNull()?.resolved.scaling ?? 1);
}
