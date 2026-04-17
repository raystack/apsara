'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { ReactNode, useContext } from 'react';
import { Menu } from '../menu';
import { Tooltip } from '../tooltip';
import styles from './sidebar.module.css';
import { SidebarLeadingVisual } from './sidebar-leading-visual';
import { SidebarMoreProvider } from './sidebar-more-context';
import { SidebarContext } from './sidebar-root';

export interface SidebarMoreProps {
  children?: ReactNode;
  label?: string;
  leadingIcon?: ReactNode;
  classNames?: {
    root?: string;
    leadingIcon?: string;
    text?: string;
    menuContent?: string;
  };
}

export function SidebarMore({
  children,
  label = 'More',
  leadingIcon,
  classNames
}: SidebarMoreProps) {
  const { isCollapsed, position, hideCollapsedItemTooltip } =
    useContext(SidebarContext);
  if (!children) return null;
  const triggerIcon = leadingIcon ?? (
    <DotsHorizontalIcon width={16} height={16} />
  );

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
    >
      <SidebarLeadingVisual
        leadingIcon={triggerIcon}
        className={classNames?.leadingIcon}
      />
      {!isCollapsed && (
        <span className={cx(styles['nav-text'], classNames?.text)}>
          {label}
        </span>
      )}
    </button>
  );

  return (
    <Menu>
      {isCollapsed && !hideCollapsedItemTooltip ? (
        <Tooltip>
          <Tooltip.Trigger render={<Menu.Trigger render={triggerContent} />} />
          <Tooltip.Content side={position === 'left' ? 'right' : 'left'}>
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
        <SidebarMoreProvider value={{ isInsideSidebarMore: true }}>
          {children}
        </SidebarMoreProvider>
      </Menu.Content>
    </Menu>
  );
}

SidebarMore.displayName = 'Sidebar.More';
