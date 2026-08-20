'use client';

import { cx } from 'class-variance-authority';
import {
  ComponentProps,
  createContext,
  MouseEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
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
  /** Mirrors the `collapsible` prop; `'none'` means it cannot be collapsed. */
  collapsible: 'icon' | 'hidden' | 'none';
  position: 'left' | 'right';
  hideItemTooltips?: boolean;
  /** id of the sidebar element, for `aria-controls` on toggle controls. */
  sidebarId?: string;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (context === null) {
    throw new Error('useSidebar must be used inside of a <Sidebar> provider');
  }
  return context;
}

// Subcomponents rendered outside a <Sidebar> (stories, isolated tests,
// standalone reuse of an item) worked before the context became nullable,
// so they fall back to an expanded left sidebar instead of throwing.
// Internal only — consumers get the throwing hook above.
const FALLBACK_CONTEXT: SidebarContextValue = {
  isCollapsed: false,
  isPeeking: false,
  open: true,
  setOpen: () => undefined,
  collapsible: 'icon',
  position: 'left',
  hideItemTooltips: undefined
};

export function useSidebarSafe(): SidebarContextValue {
  return useContext(SidebarContext) ?? FALLBACK_CONTEXT;
}

// Menus and tooltips inside the sidebar portal their popups outside the
// <aside>, so moving the pointer into one fires mouseleave on the sidebar.
// Popups report their open state here so an active popup holds a hover
// peek open instead of collapsing it mid-use.
export const SidebarPopupContext = createContext<(open: boolean) => void>(
  () => undefined
);

export interface SidebarRootProps extends ComponentProps<'aside'> {
  position?: 'left' | 'right';
  variant?: 'plain' | 'floating' | 'inset';
  /**
   * Hide the tooltips the Sidebar adds to items: the label tooltip when
   * collapsed, and the full-text tooltip on clipped labels when expanded.
   */
  hideItemTooltips?: boolean;
  /**
   * Whether the user can collapse the sidebar, and what the collapsed
   * state looks like. Expanding always works the same: the sidebar opens
   * in place and pushes content.
   * - `'icon'`: collapses to an icon rail (default).
   * - `'hidden'`: collapses to a thin strip with no visible content.
   * - `'none'`: the sidebar cannot be collapsed; the resize handle is hidden.
   *
   * Unlike `collapsible` on `Sidebar.Group`, which renders a group
   * as an accordion.
   */
  collapsible?: 'icon' | 'hidden' | 'none';
  /**
   * Hovering a collapsed sidebar temporarily reveals it as an overlay above
   * the content, without changing the real open state. Reverts on mouse leave.
   */
  peekOnHover?: boolean;
  /**
   * Delay in milliseconds before a hover starts a peek.
   * Only applies when `peekOnHover` is set.
   * @default 100
   */
  peekDelay?: number;
  /** Tooltip shown when hovering the collapse/expand handle. */
  collapseTooltip?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DEFAULT_PEEK_DELAY = 100;

export function SidebarRoot({
  className,
  id: providedId,
  position = 'left',
  variant = 'plain',
  open: providedOpen,
  onOpenChange,
  onMouseEnter,
  onMouseLeave,
  hideItemTooltips,
  collapsible = 'icon',
  peekOnHover = false,
  peekDelay = DEFAULT_PEEK_DELAY,
  collapseTooltip,
  defaultOpen = true,
  children,
  ...props
}: SidebarRootProps) {
  const generatedId = useId();
  const sidebarId = providedId ?? generatedId;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = providedOpen ?? internalOpen;
  const [isPeeking, setIsPeeking] = useState(false);
  const peekTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const openPopupCountRef = useRef(0);
  const pointerInsideRef = useRef(false);

  const handleOpenChange = useCallback(
    (value: boolean) => {
      setInternalOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange]
  );

  const canCollapse = collapsible !== 'none';
  const canPeek = peekOnHover && canCollapse && !open;

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      onMouseEnter?.(event);
      pointerInsideRef.current = true;
      if (!canPeek) return;
      peekTimeoutRef.current = setTimeout(() => setIsPeeking(true), peekDelay);
    },
    [canPeek, onMouseEnter, peekDelay]
  );

  const handleMouseLeave = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      onMouseLeave?.(event);
      pointerInsideRef.current = false;
      clearTimeout(peekTimeoutRef.current);
      // The pointer may have moved into a portaled popup (a More menu, a
      // truncation tooltip) that visually belongs to the sidebar; hold the
      // peek until the popup closes.
      if (openPopupCountRef.current === 0) setIsPeeking(false);
    },
    [onMouseLeave]
  );

  const handlePopupOpenChange = useCallback((popupOpen: boolean) => {
    openPopupCountRef.current = Math.max(
      0,
      openPopupCountRef.current + (popupOpen ? 1 : -1)
    );
    if (openPopupCountRef.current === 0 && !pointerInsideRef.current) {
      setIsPeeking(false);
    }
  }, []);

  useEffect(() => () => clearTimeout(peekTimeoutRef.current), []);

  // Opening for real supersedes a peek. Without this, pinning the sidebar
  // open while peeking (or during the peek delay) leaves it stuck as a
  // fixed overlay until the mouse happens to leave.
  useEffect(() => {
    if (!open) return;
    clearTimeout(peekTimeoutRef.current);
    setIsPeeking(false);
  }, [open]);

  // data-open/data-closed drive the visuals, so a peek counts as open —
  // every collapse-hiding CSS rule turns off during a peek for free. The
  // real state stays in `open` (and the toggle controls' aria-expanded).
  const visualOpen = open || isPeeking;

  return (
    <SidebarContext
      value={{
        isCollapsed: !open && !isPeeking,
        isPeeking,
        open,
        setOpen: handleOpenChange,
        collapsible,
        position,
        hideItemTooltips,
        sidebarId
      }}
    >
      <SidebarPopupContext value={handlePopupOpenChange}>
        <aside
          id={sidebarId}
          className={cx(styles.root, className)}
          data-position={position}
          data-variant={variant}
          data-open={visualOpen ? '' : undefined}
          data-closed={!visualOpen ? '' : undefined}
          data-collapse-mode={collapsible}
          data-peeking={isPeeking ? '' : undefined}
          data-slot='sidebar'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label='Navigation Sidebar'
          role='navigation'
          {...props}
        >
          {canCollapse && (
            <Tooltip trackCursorAxis='y'>
              <Tooltip.Trigger
                render={
                  <button
                    type='button'
                    className={styles['resize-handle']}
                    data-slot='sidebar-toggle'
                    onClick={() => handleOpenChange(!open)}
                    aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
                    aria-expanded={open}
                    aria-controls={sidebarId}
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
      </SidebarPopupContext>
    </SidebarContext>
  );
}

SidebarRoot.displayName = 'Sidebar';
