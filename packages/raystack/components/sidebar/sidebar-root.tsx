'use client';

import { cx } from 'class-variance-authority';
import {
  ComponentProps,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { Tooltip } from '../tooltip';
import styles from './sidebar.module.css';

export interface SidebarContextValue {
  isCollapsed: boolean;
  isPeeking: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  collapsible: boolean;
  position: 'left' | 'right';
  hideCollapsedItemTooltip?: boolean;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (context === null) {
    throw new Error('useSidebar must be used inside of a <Sidebar> provider');
  }
  return context;
}

export interface SidebarRootProps extends ComponentProps<'aside'> {
  position?: 'left' | 'right';
  variant?: 'plain' | 'floating' | 'inset';
  hideCollapsedItemTooltip?: boolean;
  /**
   * Lets the user collapse and expand the whole sidebar.
   * Unlike `collapsible` on `Sidebar.Group`, which renders a group
   * as an accordion.
   */
  collapsible?: boolean;
  /**
   * What the collapsed state looks like.
   * - `'icon'`: shrinks to an icon rail, pushes content (default).
   * - `'hidden'`: disappears completely, reveals as a floating panel with a
   *   backdrop when opened.
   */
  collapseMode?: 'icon' | 'hidden';
  /**
   * Hovering a collapsed sidebar temporarily reveals it as a floating panel,
   * without changing the real open state. Reverts on mouse leave.
   */
  peekOnHover?: boolean;
  /** Tooltip shown when hovering the collapse/expand handle. */
  collapseTooltip?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PEEK_OPEN_DELAY = 100;

export function SidebarRoot({
  className,
  position = 'left',
  variant = 'plain',
  open: providedOpen,
  onOpenChange,
  hideCollapsedItemTooltip,
  collapsible = true,
  collapseMode = 'icon',
  peekOnHover = false,
  collapseTooltip,
  defaultOpen = true,
  children,
  ...props
}: SidebarRootProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = providedOpen ?? internalOpen;
  const [isPeeking, setIsPeeking] = useState(false);
  const peekTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleOpenChange = useCallback(
    (value: boolean) => {
      setInternalOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange]
  );

  const canPeek = peekOnHover && collapsible && !open;

  const handleMouseEnter = useCallback(() => {
    if (!canPeek) return;
    peekTimeoutRef.current = setTimeout(
      () => setIsPeeking(true),
      PEEK_OPEN_DELAY
    );
  }, [canPeek]);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(peekTimeoutRef.current);
    setIsPeeking(false);
  }, []);

  useEffect(() => () => clearTimeout(peekTimeoutRef.current), []);

  // A "hidden" collapse only ever reveals as a floating panel over content;
  // peeking previews the same floating panel without touching `open`.
  const isFloating = collapseMode === 'hidden' && open;
  const showFloating = isFloating || isPeeking;

  useEffect(() => {
    if (!isFloating) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleOpenChange(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFloating, handleOpenChange]);

  return (
    <SidebarContext
      value={{
        isCollapsed: !open && !isPeeking,
        isPeeking,
        open,
        setOpen: handleOpenChange,
        collapsible,
        position,
        hideCollapsedItemTooltip
      }}
    >
      {collapseMode === 'hidden' && (
        <div
          className={styles.backdrop}
          data-open={isFloating ? '' : undefined}
          aria-hidden='true'
          onClick={() => handleOpenChange(false)}
        />
      )}
      <aside
        className={cx(styles.root, className)}
        data-position={position}
        data-variant={variant}
        data-open={open ? '' : undefined}
        data-closed={!open ? '' : undefined}
        data-collapse-disabled={!collapsible ? '' : undefined}
        data-collapse-mode={collapseMode}
        data-floating={showFloating ? '' : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label='Navigation Sidebar'
        aria-expanded={open}
        role='navigation'
        {...props}
      >
        {collapsible && (
          <Tooltip trackCursorAxis='y'>
            <Tooltip.Trigger
              render={
                <div
                  className={styles.resizeHandle}
                  onClick={() => handleOpenChange(!open)}
                  role='button'
                  tabIndex={0}
                  aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenChange(!open);
                    }
                  }}
                />
              }
            />
            <Tooltip.Content
              side={position === 'left' ? 'right' : 'left'}
              sideOffset={10}
            >
              {collapseTooltip ??
                (open ? 'Click to collapse' : 'Click to expand')}
            </Tooltip.Content>
          </Tooltip>
        )}
        {children}
      </aside>
    </SidebarContext>
  );
}

SidebarRoot.displayName = 'Sidebar';
