'use client';

import { useEffect, useRef } from 'react';

interface UseInfiniteScrollParams {
  /** When false, no observer is attached. */
  enabled: boolean;
  /** Sentinel element observed near the end of the list. */
  sentinelRef: React.RefObject<Element | null>;
  /** Scroll container used as the IntersectionObserver root. */
  scrollRef: React.RefObject<Element | null>;
  /** Suppresses the trigger while a previous fetch is in flight. */
  isLoading?: boolean;
  /** Fires when the sentinel intersects the root viewport. */
  onLoadMore?: () => void;
  /**
   * Distance past the bottom edge that still counts as "near the end". The
   * sentinel fires once the user scrolls within this many pixels of it.
   * Default 200.
   */
  rootMargin?: number;
}

/**
 * Single sentinel-based load-more. Used by both virtualized and non-virtualized
 * renderers so behaviour stays identical regardless of the row model.
 *
 * The sentinel itself is a sibling rendered after the rows by the caller; this
 * hook only attaches the observer. `isLoading` and `onLoadMore` are tracked
 * through refs so the observer doesn't re-attach on every render.
 */
export function useInfiniteScroll({
  enabled,
  sentinelRef,
  scrollRef,
  isLoading,
  onLoadMore,
  rootMargin = 200
}: UseInfiniteScrollParams) {
  const onLoadMoreRef = useRef(onLoadMore);
  const isLoadingRef = useRef(isLoading);

  onLoadMoreRef.current = onLoadMore;
  isLoadingRef.current = isLoading;

  useEffect(() => {
    if (!enabled) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const root = scrollRef.current ?? null;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (isLoadingRef.current) return;
        onLoadMoreRef.current?.();
      },
      {
        root,
        rootMargin: `0px 0px ${rootMargin}px 0px`,
        threshold: 0
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
    // sentinelRef/scrollRef are stable refs; re-attach only when enable flips.
  }, [enabled, rootMargin, sentinelRef, scrollRef]);
}
