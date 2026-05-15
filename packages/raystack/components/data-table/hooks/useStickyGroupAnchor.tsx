import { useCallback, useLayoutEffect, useState } from 'react';
import { GroupedData } from '../data-table.types';

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
 * Tracks the active group for the virtualized sticky group anchor.
 *
 * Picks the latest group whose `start` offset has been scrolled past, so the
 * anchor's content stays in sync with the natural section header underneath.
 *
 * Returns the current group's data plus the row index of its natural section
 * header — the consumer hides that row in the virtualized body so the natural
 * header doesn't visually slide past the anchor (matching the non-virtualized
 * table where CSS sticky pins each section header at the offset).
 *
 * `start` is supplied by the caller (computed from row sizes) rather than read
 * from the virtualizer's measurements cache, so it stays correct across data
 * loads even before the virtualizer has measured shifted rows.
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

    let currentIdx = -1;
    for (let i = 0; i < groupHeaderList.length; i++) {
      if (groupHeaderList[i].start <= scrollTop) {
        currentIdx = i;
      } else {
        break;
      }
    }

    if (currentIdx < 0) {
      setStickyGroup(null);
      setStickyGroupIndex(null);
      return;
    }

    setStickyGroup(groupHeaderList[currentIdx].data);
    setStickyGroupIndex(groupHeaderList[currentIdx].index);
  }, [enabled, groupHeaderList, scrollContainerRef]);

  useLayoutEffect(() => {
    recompute();
  }, [recompute]);

  return { stickyGroup, stickyGroupIndex, recompute };
}
