'use client';

import { cx } from 'class-variance-authority';
import {
  ComponentPropsWithoutRef,
  ComponentRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState
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
}

export const NavbarRoot = forwardRef<ComponentRef<'nav'>, NavbarRootProps>(
  (
    {
      className,
      sticky = false,
      shadow = true,
      hideOnScroll = false,
      children,
      ...props
    },
    ref
  ) => {
    // hideOnScroll: whether navbar is currently hidden (driven by scroll position/direction)
    const [hidden, setHidden] = useState(false);
    // Last scroll position; used to compute delta and drive hide/show
    const lastScrollY = useRef(0);
    // Accumulated scroll delta in current direction; makes slow scrolls still trigger hide/show
    const accum = useRef(0);
    // Nav DOM node; used to find scroll container and attach listeners
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (!hideOnScroll) return;

      const el = navRef.current;
      if (!el) return;

      const scrollContainer = getScrollParent(el);
      const isWindow = scrollContainer === null;

      // Throttle scroll work to one update per frame
      let ticking = false;
      const handleScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const scrollY = isWindow
            ? (window.scrollY ?? document.documentElement.scrollTop)
            : scrollContainer!.scrollTop;
          const delta = scrollY - lastScrollY.current;
          lastScrollY.current = scrollY;

          if (scrollY <= SHOW_AT_TOP_THRESHOLD) {
            setHidden(false);
            accum.current = 0;
          } else if (delta > 0) {
            // Scrolling down: add to accum, reset if we were scrolling up
            accum.current = accum.current > 0 ? accum.current + delta : delta;
            if (accum.current >= SCROLL_THRESHOLD) {
              setHidden(true);
              accum.current = 0;
            }
          } else if (delta < 0) {
            // Scrolling up: add to accum (delta is negative), reset if we were scrolling down
            accum.current = accum.current < 0 ? accum.current + delta : delta;
            if (accum.current <= -SCROLL_THRESHOLD) {
              setHidden(false);
              accum.current = 0;
            }
          }
          ticking = false;
        });
      };

      // Listen on window when there is no scrollable parent; otherwise use that parent
      if (isWindow) {
        if (typeof window === 'undefined') return;
        lastScrollY.current =
          window.scrollY ?? document.documentElement.scrollTop;
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
      }

      if (scrollContainer) {
        lastScrollY.current = scrollContainer.scrollTop;
        scrollContainer.addEventListener('scroll', handleScroll, {
          passive: true
        });
        return () =>
          scrollContainer.removeEventListener('scroll', handleScroll);
      }
    }, [hideOnScroll]);

    // Merge internal nav ref with forwarded ref so callers can also attach a ref
    const setRef = useCallback(
      (node: HTMLElement | null) => {
        navRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    return (
      <nav
        ref={setRef}
        className={cx(styles.root, className)}
        data-sticky={sticky}
        data-shadow={shadow}
        data-hidden={hideOnScroll ? hidden : undefined}
        role='navigation'
        {...props}
      >
        <div className={styles.container}>{children}</div>
      </nav>
    );
  }
);

NavbarRoot.displayName = 'Navbar';
