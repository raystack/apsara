'use client';
import { cx } from 'class-variance-authority';
import { TOCItemType } from 'fumadocs-core/toc';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './toc.module.css';

interface Heading {
  title: React.ReactNode;
  level: number;
  id: string;
  url: string;
  yPosition: number;
}

const ARTICLE_SELECTOR = '[data-article-content]';
const TICK_HEIGHT = 20;
const NAV_HEIGHT = 60;

/**
 * Calculate the number of ticks and max position that fit within container height.
 * This ensures all positions stay confined within the tick range.
 */
function calculateTickBounds(containerHeight: number) {
  // Number of ticks that fit (including tick at position 0)
  const numTicks = Math.floor(containerHeight / TICK_HEIGHT) + 1;
  // Maximum valid position (last tick position)
  const maxPosition = (numTicks - 1) * TICK_HEIGHT;
  return { numTicks, maxPosition };
}

/**
 * Snap a value to the nearest tick position, clamped within valid range.
 */
function snapToTick(value: number, maxPosition: number): number {
  const snapped = Math.round(value / TICK_HEIGHT) * TICK_HEIGHT;
  return Math.max(0, Math.min(snapped, maxPosition));
}

/**
 * Resolve overlapping heading positions by ensuring each heading
 * is at least one tick apart from the previous one.
 * Uses a two-pass algorithm:
 * 1. Push down any overlapping headings
 * 2. If any exceed maxPosition, push back from the end
 */
function resolveOverlaps(headings: Heading[], maxPosition: number): Heading[] {
  if (headings.length <= 1) return headings;

  // First pass: push down to create gaps
  const resolved: Heading[] = [];
  let lastUsedPos = -TICK_HEIGHT;

  for (const heading of headings) {
    let newPos = heading.yPosition;

    // If this position would overlap with the last used, bump it down
    if (newPos <= lastUsedPos) {
      newPos = lastUsedPos + TICK_HEIGHT;
    }

    resolved.push({ ...heading, yPosition: newPos });
    lastUsedPos = newPos;
  }

  // Second pass: if any exceed maxPosition, push back from the end
  for (let i = resolved.length - 1; i >= 0; i--) {
    const maxAllowed =
      i === resolved.length - 1
        ? maxPosition
        : resolved[i + 1].yPosition - TICK_HEIGHT;

    if (resolved[i].yPosition > maxAllowed) {
      resolved[i] = { ...resolved[i], yPosition: Math.max(0, maxAllowed) };
    }
  }

  return resolved;
}

/**
 * A lightweight Table of Contents (ToC) sidebar.
 * Automatically detects h2–h4 headings inside an element marked with [data-article-content].
 * Displays a scroll-progress bar with clickable section anchors.
 */
export default function TableOfContents({
  headings: tocHeadings
}: { headings: TOCItemType[] }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(false);
  const [isScrollable, setIsScrollable] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollMarkerRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef<number>(0);

  // Derive tick bounds from container height
  const { numTicks, maxPosition } = useMemo(
    () => calculateTickBounds(containerHeight),
    [containerHeight]
  );

  /** Recalculate heading positions within the article */
  const recalcHeadings = useCallback(() => {
    const article = document.querySelector(ARTICLE_SELECTOR);
    const container = containerRef.current;
    if (!article || !container || !tocHeadings.length) return;

    const articleBox = article.getBoundingClientRect();
    const containerBox = container.getBoundingClientRect();
    const articleTop = articleBox.top + window.scrollY;

    // Check if content is scrollable (article height > viewport height)
    const hasScroll = articleBox.height > window.innerHeight;
    setIsScrollable(hasScroll);

    // Store container height - tick bounds are derived via useMemo
    setContainerHeight(containerBox.height);

    // Calculate the max position for this container height
    const { maxPosition: maxPos } = calculateTickBounds(containerBox.height);

    const items = tocHeadings
      .map(tocItem => {
        // Extract id from url (url is like "#heading-id" or "heading-id")
        const id = tocItem.url.startsWith('#')
          ? tocItem.url.slice(1)
          : tocItem.url;
        const node = document.getElementById(id);
        if (!node) return null;

        const { top } = node.getBoundingClientRect();
        // Calculate heading's position within the article
        const headingPosInArticle = top + window.scrollY - articleTop;
        // Map heading position [0, articleHeight] to tick range [0, maxPos]
        // Using articleHeight ensures headings are distributed across ALL ticks
        const progress = headingPosInArticle / articleBox.height;
        const rawY = progress * maxPos;
        const yPos = snapToTick(rawY, maxPos);

        return {
          title: tocItem.title,
          level: tocItem.depth,
          id: id,
          url: tocItem.url,
          yPosition: yPos
        };
      })
      .filter((item): item is Heading => item !== null);

    // Resolve any overlapping positions so headings don't stack on same tick
    const resolvedItems = resolveOverlaps(items, maxPos);

    setHeadings(resolvedItems);
  }, [tocHeadings]);

  /** Update scroll marker position via direct DOM manipulation (no state update) */
  const handleScroll = useCallback(() => {
    const article = document.querySelector(ARTICLE_SELECTOR);
    const container = containerRef.current;
    const scrollMarker = scrollMarkerRef.current;
    if (!article || !container || !scrollMarker) return;

    const { top, height } = article.getBoundingClientRect();
    const { height: cHeight } = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate max position from current container height
    const { maxPosition: maxPos } = calculateTickBounds(cHeight);

    let newScrollPos: number;
    if (top > 0) {
      newScrollPos = 0;
    } else {
      const scrolled = Math.abs(top);
      const scrollRange = height - viewportHeight;
      // Map scroll progress [0, 1] to tick range [0, maxPos]
      const progress =
        scrollRange > 0 ? Math.min(1, scrolled / scrollRange) : 0;
      const rawPos = progress * maxPos;
      newScrollPos = snapToTick(rawPos, maxPos);
    }

    const prevScrollPos = scrollPosRef.current;

    // Only update DOM if position changed
    if (newScrollPos !== prevScrollPos) {
      scrollPosRef.current = newScrollPos;

      // Update scroll marker position and text directly
      scrollMarker.style.top = `${newScrollPos}px`;
      const textEl = scrollMarker.querySelector('[data-scroll-text]');
      if (textEl) {
        textEl.textContent = (maxPos > 0 ? newScrollPos / maxPos : 0).toFixed(
          2
        );
      }

      // Update tick line classes based on new scroll position
      const tickLines = container.querySelectorAll('[data-tick-line]');
      tickLines.forEach(tick => {
        const tickPos = Number(tick.getAttribute('data-tick-pos'));
        if (tickPos < newScrollPos) {
          tick.classList.remove(styles.tickLineAfter);
          tick.classList.add(styles.tickLineBefore);
        } else {
          tick.classList.remove(styles.tickLineBefore);
          tick.classList.add(styles.tickLineAfter);
        }
      });
    }
  }, []);

  /** Setup listeners */
  useEffect(() => {
    const init = setTimeout(() => {
      recalcHeadings();
      handleScroll();
      setReady(true);
    }, 250);

    window.addEventListener('resize', recalcHeadings);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(init);
      window.removeEventListener('resize', recalcHeadings);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [recalcHeadings, handleScroll]);

  /** Scroll to a position based on tick Y coordinate (for tick clicks) */
  const scrollToTick = (y: number): void => {
    const article = document.querySelector(ARTICLE_SELECTOR);
    if (!article || maxPosition === 0) return;

    const articleBox = article.getBoundingClientRect();
    const articleTop = articleBox.top + window.scrollY;

    // Map tick position to article position using the SAME mapping as headings:
    //   Headings: tickPos = (headingPosInArticle / articleHeight) * maxPosition
    //   Reverse:  articlePos = (tickPos / maxPosition) * articleHeight
    // This ensures clicking a tick near a heading scrolls to show that heading
    const progress = y / maxPosition;
    const articlePos = progress * articleBox.height;
    const targetScroll = articleTop + articlePos - NAV_HEIGHT;

    window.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: 'smooth'
    });
  };

  /** Scroll directly to a heading element by ID (for heading clicks) */
  const scrollToHeading = (id: string): void => {
    const element = document.getElementById(id);
    if (!element) return;

    const elementTop = element.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: Math.max(0, elementTop - NAV_HEIGHT),
      behavior: 'smooth'
    });
  };

  /** Generate tick positions */
  const ticks = useMemo(
    () => Array.from({ length: numTicks }, (_, i) => i * TICK_HEIGHT),
    [numTicks]
  );

  // Don't render TOC if content is not scrollable
  if (!isScrollable || ticks.length < 2) {
    return <div ref={containerRef} className={styles.container} />;
  }

  return (
    <div ref={containerRef} className={styles.container} id='toc-container'>
      <div className={styles.inner}>
        {/* Tick marks */}
        {ticks.map((y, i) => (
          <div
            key={`tick-${i}`}
            style={{ top: `${y}px` }}
            className={styles.tickContainer}
          >
            <div
              data-tick-line
              data-tick-pos={y}
              className={cx(styles.tickLine, styles.tickLineAfter)}
            />
            <div
              className={styles.tickClickable}
              onClick={() => scrollToTick(y)}
            />
          </div>
        ))}

        {/* Heading labels - positioned at snapped tick positions */}
        {headings.map((h, i) => (
          <div key={h.id || i} className={styles.headingContainer}>
            <div
              className={styles.headingLabel}
              style={{
                // Center label vertically on tick (label height ~12px, so offset by half)
                top: `${h.yPosition - 6}px`,
                // Indent based on heading level (h2 furthest right, h4 closest to bar)
                right: `${(3 - h.level) * 4 + 32}px`,
                zIndex: 10 * (h.level < 4 ? 1 : 0),
                transitionDelay: `${50 * i}ms`
              }}
            >
              <a
                href={h.url}
                className={styles.headingLink}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  scrollToHeading(h.id);
                }}
              >
                {h.title}
              </a>
            </div>
          </div>
        ))}

        {/* Connecting lines - positioned exactly at tick positions */}
        {headings.map((h, i) => (
          <div
            key={`line-${i}`}
            className={styles.connectingLine}
            style={{
              // Line sits exactly on the tick
              top: `${h.yPosition}px`,
              // Width based on heading level (h2 longest, h4 shortest)
              width: `${(3 - h.level) * 4 + 12}px`
            }}
          />
        ))}

        {/* Scroll marker - position updated via direct DOM manipulation */}
        <div
          ref={scrollMarkerRef}
          className={cx(
            styles.scrollMarkerContainer,
            ready
              ? styles.scrollMarkerContainerReady
              : styles.scrollMarkerContainerNotReady
          )}
          style={{ top: '0px' }}
        >
          <div className={styles.scrollMarkerLine} />
          <span data-scroll-text className={styles.scrollMarkerText}>
            0.00
          </span>
        </div>
      </div>
    </div>
  );
}
