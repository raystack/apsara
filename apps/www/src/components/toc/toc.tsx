'use client';

import { cx } from 'class-variance-authority';
import { TOCItemType } from 'fumadocs-core/toc';
import { useEffect, useState } from 'react';
import styles from './toc.module.css';

// The navbar is 50px and sticky, so a heading scrolled to the very top would
// sit under it. Everything above this line in the viewport counts as covered.
const NAV_OFFSET = 64;

function idOf(url: string) {
  return url.startsWith('#') ? url.slice(1) : url;
}

/**
 * The list of headings on the current page, with the one being read marked.
 *
 * Active heading is resolved from scroll position rather than an
 * IntersectionObserver: the reader is "at" the last heading that has passed
 * under the navbar, which is a question about where the page is scrolled to,
 * not about which headings happen to be on screen. An observer answers the
 * second question and leaves nothing marked whenever a section is taller than
 * the viewport.
 */
export default function TableOfContents({
  headings
}: {
  headings: TOCItemType[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!headings.length) return;

    const update = () => {
      const positions = headings
        .map(heading => {
          const node = document.getElementById(idOf(heading.url));
          if (!node) return null;
          return {
            id: idOf(heading.url),
            top: node.getBoundingClientRect().top
          };
        })
        .filter(
          (entry): entry is { id: string; top: number } => entry !== null
        );

      if (!positions.length) return;

      // The bottom of the page can't scroll far enough to bring the last
      // headings under the navbar, so once there they take the mark.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;

      if (atBottom) {
        setActiveId(positions[positions.length - 1].id);
        return;
      }

      const passed = positions.filter(entry => entry.top <= NAV_OFFSET);
      setActiveId(
        passed.length ? passed[passed.length - 1].id : positions[0].id
      );
    };

    update();

    // Landing on a #hash scrolls the page after this effect has run, and the
    // jump does not always announce itself as a scroll, so re-read once the
    // browser has settled.
    const settle = window.setTimeout(update, 200);

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('hashchange', update);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('hashchange', update);
    };
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav className={styles.rail} aria-label='On this page'>
      <span className={styles.eyebrow}>On this page</span>
      <ul className={styles.list}>
        {headings.map(heading => {
          const id = idOf(heading.url);
          return (
            <li key={id}>
              <a
                href={heading.url}
                data-depth={heading.depth}
                className={cx(
                  styles.link,
                  activeId === id && styles.linkActive
                )}
                aria-current={activeId === id ? 'location' : undefined}
              >
                {heading.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
