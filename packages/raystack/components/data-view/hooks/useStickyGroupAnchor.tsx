'use client';

import { useCallback, useLayoutEffect, useState } from 'react';
import { GroupedData } from '../data-view.types';

interface UseStickyGroupAnchorParams<TData> {
  enabled: boolean;
  groupHeaderList: {
    index: number;
    start: number;
    data: GroupedData<TData>;
  }[];
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

interface UseStickyGroupAnchorResult<TData> {
  stickyGroup: GroupedData<TData> | null;
  stickyGroupIndex: number | null;
  recompute: () => void;
}

/**
 * Tracks the active group for a virtualized sticky group anchor. Picks the
 * latest group whose `start` offset has been scrolled past so the anchor's
 * content stays in sync with the natural section header underneath.
 *
 * The consumer hides the natural row at `stickyGroupIndex` so it doesn't slide
 * past the anchor.
 */
export function useStickyGroupAnchor<TData>({
  enabled,
  groupHeaderList,
  scrollContainerRef
}: UseStickyGroupAnchorParams<TData>): UseStickyGroupAnchorResult<TData> {
  const [stickyGroup, setStickyGroup] = useState<GroupedData<TData> | null>(
    null
  );
  const [stickyGroupIndex, setStickyGroupIndex] = useState<number | null>(null);

  const recompute = useCallback(() => {
    if (!enabled || groupHeaderList.length === 0) {
      setStickyGroup(null);
      setStickyGroupIndex(null);
      return;
    }
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollTop = el.scrollTop;

    // Binary search: largest `i` such that groupHeaderList[i].start <= scrollTop.
    // `groupHeaderList` is built in row order so `start` is strictly increasing,
    // which makes this safe for thousands of groups (typical large-dataset case).
    let lo = 0;
    let hi = groupHeaderList.length - 1;
    let currentIdx = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (groupHeaderList[mid].start <= scrollTop) {
        currentIdx = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    if (currentIdx < 0) {
      setStickyGroup(null);
      setStickyGroupIndex(null);
      return;
    }

    const next = groupHeaderList[currentIdx];
    // React bails out on identical values, but we short-circuit before the
    // setState calls anyway so we don't allocate or schedule needlessly.
    setStickyGroupIndex(prev => (prev === next.index ? prev : next.index));
    setStickyGroup(prev => (prev === next.data ? prev : next.data));
  }, [enabled, groupHeaderList, scrollContainerRef]);

  useLayoutEffect(() => {
    recompute();
  }, [recompute]);

  return { stickyGroup, stickyGroupIndex, recompute };
}
