'use client';

import { useVirtualizer, type VirtualItem } from '@tanstack/react-virtual';

interface UseVirtualRowsParams<TRow> {
  enabled: boolean;
  rows: TRow[];
  scrollRef: React.RefObject<HTMLElement | null>;
  estimatedRowHeight: number;
  estimateSize: (row: TRow | undefined, index: number) => number;
  overscan?: number;
}

interface UseVirtualRowsResult {
  totalSize: number;
  items: VirtualItem[];
  measureRef: ((el: HTMLElement | null) => void) | undefined;
}

const DEFAULT_OVERSCAN = 8;

/**
 * Wraps `useVirtualizer` with auto-measurement. Consumers pass an initial
 * `estimatedRowHeight` and an `estimateSize(row, i)` that can return a
 * different size for special rows (e.g. group headers). After paint, the
 * virtualizer's `measureElement` re-measures each row so variable-height
 * content settles correctly.
 *
 * When `enabled` is false the hook still calls `useVirtualizer` (so hook order
 * stays stable) but reports `count: 0` and surfaces empty values — the
 * consumer renders rows in natural flow instead.
 */
export function useVirtualRows<TRow>({
  enabled,
  rows,
  scrollRef,
  estimatedRowHeight,
  estimateSize,
  overscan = DEFAULT_OVERSCAN
}: UseVirtualRowsParams<TRow>): UseVirtualRowsResult {
  const virtualizer = useVirtualizer({
    count: enabled ? rows.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: index => estimateSize(rows[index], index),
    overscan,
    initialRect:
      typeof window === 'undefined'
        ? { width: 0, height: estimatedRowHeight * overscan }
        : undefined
  });

  if (!enabled) {
    return { totalSize: 0, items: [], measureRef: undefined };
  }

  return {
    totalSize: virtualizer.getTotalSize(),
    items: virtualizer.getVirtualItems(),
    measureRef: virtualizer.measureElement
  };
}
