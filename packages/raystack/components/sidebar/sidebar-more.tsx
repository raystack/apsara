'use client';

import { cx } from 'class-variance-authority';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { EllipsisIcon } from '~/icons';
import { Menu } from '../menu';
import { Tooltip } from '../tooltip';
import styles from './sidebar.module.css';
import { SidebarLeadingVisual } from './sidebar-leading-visual';
import { SidebarMoreContext } from './sidebar-more-context';
import { SidebarPopupContext, useSidebarSafe } from './sidebar-root';

export interface SidebarMoreProps {
  children?: ReactNode;
  label?: string;
  leadingIcon?: ReactNode;
  classNames?: {
    /** @deprecated Use `[data-slot="sidebar-more-trigger"]` instead. */
    root?: string;
    /** @deprecated Use `[data-slot="sidebar-leading-icon"]` instead. */
    leadingIcon?: string;
    /** @deprecated Use `[data-slot="sidebar-more-text"]` instead. */
    text?: string;
    /**
     * Not deprecated: `Menu.Content` portals to `document.body`, so a
     * `[data-slot="menu-content"]` selector can't be scoped to just this
     * instance's dropdown — this prop remains the only way to target it.
     */
    menuContent?: string;
  };
}

export function SidebarMore({
  children,
  label = 'More',
  leadingIcon,
  classNames
}: SidebarMoreProps) {
  const { isCollapsed, position, hideItemTooltips } = useSidebarSafe();
  const onPopupOpenChange = useContext(SidebarPopupContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // The menu portals outside the sidebar; report its open state so moving
  // the pointer into it doesn't collapse a hover peek. An effect (not the
  // onOpenChange handler) so unmounting mid-menu still decrements the
  // sidebar's open-popup count.
  useEffect(() => {
    if (!menuOpen) return;
    onPopupOpenChange(true);
    return () => onPopupOpenChange(false);
  }, [menuOpen, onPopupOpenChange]);

  if (!children) return null;

  const triggerIcon = leadingIcon ?? <EllipsisIcon width={16} height={16} />;

  const triggerContent = (
    <button
      type='button'
      className={cx(
        styles['nav-item'],
        styles['more-trigger'],
        classNames?.root
      )}
      role='listitem'
      aria-label={isCollapsed ? label : undefined}
      data-slot='sidebar-more-trigger'
    >
      <SidebarLeadingVisual
        leadingIcon={triggerIcon}
        className={classNames?.leadingIcon}
      />
      {/* Kept mounted so it can collapse with the sidebar (max-width → 0)
          instead of popping out; CSS hides it when closed. */}
      <span
        className={cx(styles['nav-text'], classNames?.text)}
        data-slot='sidebar-more-text'
      >
        {label}
      </span>
    </button>
  );

  return (
    <Menu onOpenChange={setMenuOpen}>
      {isCollapsed && !hideItemTooltips ? (
        <Tooltip>
          <Tooltip.Trigger render={<Menu.Trigger render={triggerContent} />} />
          <Tooltip.Content
            side={position === 'left' ? 'right' : 'left'}
            sideOffset={16}
          >
            {label}
          </Tooltip.Content>
        </Tooltip>
      ) : (
        <Menu.Trigger render={triggerContent} />
      )}
      <Menu.Content
        className={classNames?.menuContent}
        side={position === 'left' ? 'right' : 'left'}
      >
        <SidebarMoreContext value={true}>{children}</SidebarMoreContext>
      </Menu.Content>
    </Menu>
  );
}

SidebarMore.displayName = 'Sidebar.More';
