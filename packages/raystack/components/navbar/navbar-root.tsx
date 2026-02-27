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
import { Flex } from '../flex';
import styles from './navbar.module.css';

const SCROLL_THRESHOLD = 10;
const SHOW_AT_TOP_THRESHOLD = 20;

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
  sticky?: boolean;
  shadow?: boolean;
  /** Hide navbar when user scrolls down, show when they scroll up. Uses scroll parent or window. */
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
    const [hidden, setHidden] = useState(false);
    const lastScrollY = useRef(0);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (!hideOnScroll) return;

      const el = navRef.current;
      if (!el) return;

      const scrollContainer = getScrollParent(el);
      const isWindow = scrollContainer === null;

      let ticking = false;
      const handleScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const scrollY = isWindow
            ? (window.scrollY ?? document.documentElement.scrollTop)
            : scrollContainer!.scrollTop;
          if (scrollY <= SHOW_AT_TOP_THRESHOLD) {
            setHidden(false);
          } else if (scrollY > lastScrollY.current + SCROLL_THRESHOLD) {
            setHidden(true);
          } else if (scrollY < lastScrollY.current - SCROLL_THRESHOLD) {
            setHidden(false);
          }
          lastScrollY.current = scrollY;
          ticking = false;
        });
      };

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
        <Flex align='center' justify='between' className={styles.container}>
          {children}
        </Flex>
      </nav>
    );
  }
);

NavbarRoot.displayName = 'Navbar';
