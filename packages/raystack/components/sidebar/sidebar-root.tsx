'use client';

import { cva } from 'class-variance-authority';
import { Collapsible } from 'radix-ui';
import {
  ComponentPropsWithoutRef,
  ComponentRef,
  ReactNode,
  createContext,
  forwardRef,
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

const root = cva(styles.root);

export interface SidebarRootProps
  extends ComponentPropsWithoutRef<typeof Collapsible.Root> {
  position?: 'left' | 'right';
  hideCollapsedItemTooltip?: boolean;
  collapsible?: boolean;
  tooltipMessage?: ReactNode;
}

export const SidebarRoot = forwardRef<
  ComponentRef<typeof Collapsible.Root>,
  SidebarRootProps
>(
  (
    {
      className,
      position = 'left',
      open: providedOpen,
      onOpenChange,
      hideCollapsedItemTooltip,
      collapsible = true,
      tooltipMessage,
      defaultOpen,
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
          <Collapsible.Root
            ref={ref}
            className={root({ className })}
            data-position={position}
            data-state={open ? 'expanded' : 'collapsed'}
            data-collapse-disabled={!collapsible}
            open={open}
            onOpenChange={collapsible ? handleOpenChange : undefined}
            aria-label='Navigation Sidebar'
            aria-expanded={open}
            role='navigation'
            {...props}
            asChild
          >
            <aside>
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
          </Collapsible.Root>
        </Tooltip.Provider>
      </SidebarContext.Provider>
    );
  }
);

SidebarRoot.displayName = 'Sidebar';
