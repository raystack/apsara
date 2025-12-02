'use client';
import { cx } from 'class-variance-authority';
import { TOCItemType } from 'fumadocs-core/toc';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './toc.module.css';

interface Heading {
  title: React.ReactNode;
  level: number;
  id: string;
  url: string;
  yPosition: number;
}

const ARTICLE_SELECTOR = '[data-article-content]';

/**
 * A lightweight Table of Contents (ToC) sidebar.
 * Automatically detects h2–h4 headings inside an element marked with [data-article-content].
 * Displays a scroll-progress bar with clickable section anchors.
 */
export default function TableOfContents({
  headings: tocHeadings
}: { headings: TOCItemType[] }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [tocHeight, setTocHeight] = useState<number>(0);
  const [scrollPos, setScrollPos] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(false);
  const [isScrollable, setIsScrollable] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

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

    setTocHeight(containerBox.height);

    const items = tocHeadings
      .map(tocItem => {
        // Extract id from url (url is like "#heading-id" or "heading-id")
        const id = tocItem.url.startsWith('#')
          ? tocItem.url.slice(1)
          : tocItem.url;
        const node = document.getElementById(id);
        if (!node) return null;

        const { top } = node.getBoundingClientRect();
        const y =
          ((top + window.scrollY - articleTop) /
            (articleBox.height - window.innerHeight)) *
          containerBox.height;
        const yPos = Math.max(
          0,
          Math.min(Math.round(y / 10) * 10, containerBox.height - 20)
        );
        return {
          title: tocItem.title,
          level: tocItem.depth,
          id: id,
          url: tocItem.url,
          yPosition: yPos
        };
      })
      .filter((item): item is Heading => item !== null);

    setHeadings(items);
  }, [tocHeadings]);

  /** Update scroll marker position */
  const handleScroll = useCallback(() => {
    const article = document.querySelector(ARTICLE_SELECTOR);
    const container = containerRef.current;
    if (!article || !container) return;

    const { top, height } = article.getBoundingClientRect();
    const { height: containerHeight } = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (top > 0) {
      setScrollPos(0);
      return;
    }

    const scrolled = Math.abs(top);
    const scrollRange = height - viewportHeight;
    const progress =
      (scrollRange > 0 ? Math.min(1, scrolled / scrollRange) : 0) *
      containerHeight;

    setScrollPos(Math.round(progress / 10) * 10);
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
    window.addEventListener('tocRecalculate', recalcHeadings);

    return () => {
      clearTimeout(init);
      window.removeEventListener('resize', recalcHeadings);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('tocRecalculate', recalcHeadings);
    };
  }, [recalcHeadings, handleScroll]);

  /** Scroll to a section */
  const scrollToY = (y: number): void => {
    const article = document.querySelector(ARTICLE_SELECTOR);
    if (!article) return;

    const articleBox = article.getBoundingClientRect();
    const top = articleBox.top + window.scrollY;
    const range = articleBox.height - window.innerHeight;

    window.scrollTo({
      top: top + (y / tocHeight) * range,
      behavior: 'smooth'
    });
  };

  /** Ticks every 10px */
  const ticks = Array.from(
    { length: Math.floor(tocHeight / 10) },
    (_, i) => i * 10
  );

  // Don't render TOC if content is not scrollable
  if (!isScrollable || !ticks.length) {
    return <div ref={containerRef} className={styles.container} />;
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.inner}>
        {/* Tick marks */}
        {ticks.map((y, i) => (
          <div
            key={`tick-${i}`}
            style={{ top: `${y}px` }}
            className={styles.tickContainer}
          >
            <div
              className={cx(
                styles.tickLine,
                y < scrollPos ? styles.tickLineBefore : styles.tickLineAfter
              )}
            />
            <div
              className={styles.tickClickable}
              onClick={() => scrollToY(y)}
            />
          </div>
        ))}

        {/* Heading labels */}
        {headings.map((h, i) => (
          <div key={h.id || i} className={styles.headingContainer}>
            <div
              className={styles.headingLabel}
              style={{
                top: `${h.yPosition - 6}px`,
                right: `${(3 - h.level) * 4 + 32}px`,
                zIndex: 10 * (h.level < 4 ? 1 : 0),
                transitionDelay: `${50 * i}ms`
              }}
            >
              <a href={h.url} className={styles.headingLink}>
                {h.title}
              </a>
            </div>
          </div>
        ))}

        {/* Connecting lines */}
        {headings.map((h, i) => (
          <div
            key={`line-${i}`}
            className={styles.connectingLine}
            style={{
              top: `${h.yPosition}px`,
              width: `${(3 - h.level) * 4 + 12}px`
            }}
          />
        ))}

        {/* Scroll marker */}
        <div
          className={cx(
            styles.scrollMarkerContainer,
            ready
              ? styles.scrollMarkerContainerReady
              : styles.scrollMarkerContainerNotReady
          )}
          style={{ top: `${scrollPos}px` }}
        >
          <div className={styles.scrollMarkerLine} />
          <span className={styles.scrollMarkerText}>
            {(scrollPos / tocHeight || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
