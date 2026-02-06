'use client';

import { cx } from 'class-variance-authority';
import {
  ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useState
} from 'react';
import { Tooltip } from '../tooltip';
import styles from './sidebar.module.css';

export interface SidebarContextValue {
  isCollapsed: boolean;
  hideCollapsedItemTooltip?: boolean;
}

export const SidebarContext = createContext<SidebarContextValue>({
  isCollapsed: false
});

export interface SidebarRootProps extends ComponentPropsWithoutRef<'aside'> {
  position?: 'left' | 'right';
  hideCollapsedItemTooltip?: boolean;
  collapsible?: boolean;
  tooltipMessage?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SidebarRoot = forwardRef<HTMLElement, SidebarRootProps>(
  (
    {
      className,
      position = 'left',
      open: providedOpen,
      onOpenChange,
      hideCollapsedItemTooltip,
      collapsible = true,
      tooltipMessage,
      defaultOpen = true,
      children,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const open = providedOpen ?? internalOpen;

    const handleOpenChange = useCallback(
      (value: boolean) => {
        setInternalOpen(value);
        onOpenChange?.(value);
      },
      [onOpenChange]
    );

    return (
      <SidebarContext.Provider
        value={{ isCollapsed: !open, hideCollapsedItemTooltip }}
      >
        <Tooltip.Provider>
          <aside
            ref={ref}
            className={cx(styles.root, className)}
            data-position={position}
            data-open={open ? '' : undefined}
            data-closed={!open ? '' : undefined}
            data-collapse-disabled={!collapsible ? '' : undefined}
            aria-label='Navigation Sidebar'
            aria-expanded={open}
            role='navigation'
            {...props}
          >
            {collapsible && (
              <Tooltip
                message={
                  tooltipMessage ??
                  (open ? 'Click to collapse' : 'Click to expand')
                }
                side={position === 'left' ? 'right' : 'left'}
                asChild
                followCursor
                sideOffset={10}
              >
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
              </Tooltip>
            )}
            {children}
          </aside>
        </Tooltip.Provider>
      </SidebarContext.Provider>
    );
  }
);

SidebarRoot.displayName = 'Sidebar';
