'use client';

import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { cx } from 'class-variance-authority';
import type { RefObject } from 'react';
import {
  ComponentPropsWithoutRef,
  ComponentRef,
  forwardRef,
  useEffect,
  useRef
} from 'react';
import styles from './navbar.module.css';

/** Px to accumulate in one scroll direction before hiding (down) or showing (up) the navbar */
const SCROLL_THRESHOLD = 5;
/** When scroll position is at or above this from top, always show the navbar */
const SHOW_AT_TOP_THRESHOLD = 20;

/**
 * Finds the nearest scrollable ancestor of el.
 * Returns null if none found (so the window is the scroll container).
 */
function getScrollParent(el: HTMLElement | null): HTMLElement | null {
  if (!el) return null;
  let parent = el.parentElement;
  while (parent) {
    const { overflowY, overflow } = getComputedStyle(parent);
    const scrollable =
      overflowY === 'auto' ||
      overflowY === 'scroll' ||
      overflowY === 'overlay' ||
      overflow === 'auto' ||
      overflow === 'scroll' ||
      overflow === 'overlay';
    if (scrollable && parent.scrollHeight > parent.clientHeight) return parent;
    parent = parent.parentElement;
  }
  return null;
}

export interface NavbarRootProps extends ComponentPropsWithoutRef<'nav'> {
  /** Stick navbar to top of viewport (or scroll container) while scrolling */
  sticky?: boolean;
  /** Show bottom shadow; set false to disable */
  shadow?: boolean;
  /** Hide navbar when scrolling down, show when scrolling up or near top */
  hideOnScroll?: boolean;
  /** Ref to the scroll container. When provided (and current is set), used for hide-on-scroll instead of auto-detection. Otherwise the nearest scrollable ancestor or window is used. */
  scrollContainerRef?: RefObject<HTMLElement | null>;
}

export const NavbarRoot = forwardRef<ComponentRef<'nav'>, NavbarRootProps>(
  (
    {
      className,
      sticky = false,
      shadow = true,
      hideOnScroll = false,
      scrollContainerRef,
      children,
      ...props
    },
    ref
  ) => {
    // Last scroll position at which we updated data-hidden; only updated when we show/hide or are at top
    const lastScrollY = useRef(0);
    // Nav DOM node; used to find scroll container, attach listeners, and set data-hidden
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (!hideOnScroll) return;

      const el = navRef.current;
      if (!el) return;

      // Use custom ref if provided and set; else detect scroll parent; else window
      const scrollContainer: HTMLElement | null =
        scrollContainerRef?.current ?? getScrollParent(el);
      const isWindow = scrollContainer === null;

      if (isWindow && typeof window === 'undefined') return;

      const target: Window | HTMLElement = isWindow
        ? window
        : (scrollContainer as HTMLElement);

      // Throttle scroll work to one update per frame
      let ticking = false;
      const getScrollTop = () =>
        target === window
          ? (window.scrollY ?? document.documentElement.scrollTop)
          : (target as HTMLElement).scrollTop;

      const handleScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const scrollY = getScrollTop();
          const nav = navRef.current;
          if (!nav) {
            ticking = false;
            return;
          }

          if (scrollY <= SHOW_AT_TOP_THRESHOLD) {
            nav.setAttribute('data-hidden', 'false');
            lastScrollY.current = scrollY;
          } else if (scrollY > lastScrollY.current + SCROLL_THRESHOLD) {
            nav.setAttribute('data-hidden', 'true');
            lastScrollY.current = scrollY;
          } else if (scrollY < lastScrollY.current - SCROLL_THRESHOLD) {
            nav.setAttribute('data-hidden', 'false');
            lastScrollY.current = scrollY;
          }
          ticking = false;
        });
      };

      lastScrollY.current = getScrollTop();
      el.setAttribute('data-hidden', 'false');
      target.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        target.removeEventListener('scroll', handleScroll);
        el.removeAttribute('data-hidden');
      };
    }, [hideOnScroll]);

    const mergedRef = useMergedRefs(navRef, ref);

    return (
      <nav
        ref={mergedRef}
        className={cx(styles.root, className)}
        data-sticky={sticky}
        data-shadow={shadow}
        role='navigation'
        {...props}
      >
        <div className={styles.container}>{children}</div>
      </nav>
    );
  }
);

NavbarRoot.displayName = 'Navbar';
