'use client';

import { mergeProps } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import {
  ComponentProps,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import { EllipsisIcon } from '~/icons';
import { Menu } from '../menu';
import type { MenuContentProps } from '../menu/menu-content';
import { Tooltip } from '../tooltip';
import styles from './sidebar.module.css';
import { SidebarLeadingVisual } from './sidebar-leading-visual';
import { SidebarMoreContext } from './sidebar-more-context';
import { SidebarPopupContext, useSidebarSafe } from './sidebar-root';

export interface SidebarMoreProps {
  children?: ReactNode;
  label?: string;
  leadingIcon?: ReactNode;
  /** Props for the inner parts. */
  slotProps?: {
    root?: ComponentProps<'button'>;
    leadingIcon?: ComponentProps<'span'>;
    text?: ComponentProps<'span'>;
    menuContent?: MenuContentProps;
  };
  /** @deprecated Use `slotProps` instead. */
  classNames?: {
    /** @deprecated Use `slotProps.root` instead. */
    root?: string;
    /** @deprecated Use `slotProps.leadingIcon` instead. */
    leadingIcon?: string;
    /** @deprecated Use `slotProps.text` instead. */
    text?: string;
    /** @deprecated Use `slotProps.menuContent` instead. */
    menuContent?: string;
  };
}

export function SidebarMore({
  children,
  label = 'More',
  leadingIcon,
  slotProps,
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
      role='listitem'
      aria-label={isCollapsed ? label : undefined}
      data-slot='sidebar-more-trigger'
      {...mergeProps<'button'>(
        {
          className: cx(
            styles['nav-item'],
            styles['more-trigger'],
            classNames?.root
          )
        },
        slotProps?.root
      )}
    >
      <SidebarLeadingVisual
        leadingIcon={triggerIcon}
        className={classNames?.leadingIcon}
        slotProps={slotProps?.leadingIcon}
      />
      {/* Kept mounted so it can collapse with the sidebar (max-width → 0)
          instead of popping out; CSS hides it when closed. */}
      <span
        data-slot='sidebar-more-text'
        {...mergeProps<'span'>(
          { className: cx(styles['nav-text'], classNames?.text) },
          slotProps?.text
        )}
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
        side={position === 'left' ? 'right' : 'left'}
        {...slotProps?.menuContent}
        className={cx(
          classNames?.menuContent,
          slotProps?.menuContent?.className
        )}
      >
        <SidebarMoreContext value={true}>{children}</SidebarMoreContext>
      </Menu.Content>
    </Menu>
  );
}

SidebarMore.displayName = 'Sidebar.More';
