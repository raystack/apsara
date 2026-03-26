'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useContext
} from 'react';
import { Menu } from '../menu';
import { Tooltip } from '../tooltip';
import styles from './sidebar.module.css';
import { SidebarItemProps } from './sidebar-item';
import { SidebarLeadingVisual } from './sidebar-leading-visual';
import { SidebarContext } from './sidebar-root';

export interface SidebarMoreProps {
  children?: ReactNode;
  label?: string;
  leadingIcon?: ReactNode;
  classNames?: {
    root?: string;
    leadingIcon?: string;
    text?: string;
    menuItem?: string;
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

  const items = Children.toArray(children).filter(
    isValidElement
  ) as ReactElement<SidebarItemProps>[];

  if (items.length === 0) return null;
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
        {items.map((item, index) => {
          const {
            leadingIcon: itemLeadingIcon,
            active,
            disabled,
            as = <a />,
            classNames: itemClassNames,
            children: itemLabel,
            ...itemProps
          } = item.props;

          const render = cloneElement(
            as,
            {
              className: cx(
                styles['nav-item'],
                styles['more-menu-item'],
                itemClassNames?.root,
                classNames?.menuItem
              ),
              'data-active': active,
              'data-disabled': disabled,
              'aria-current': active ? 'page' : undefined,
              'aria-disabled': disabled,
              ...itemProps
            },
            <>
              <SidebarLeadingVisual
                leadingIcon={itemLeadingIcon}
                fallbackText={
                  typeof itemLabel === 'string' ? itemLabel : undefined
                }
                className={itemClassNames?.leadingIcon}
              />
              <span
                className={cx(
                  styles['nav-text'],
                  styles['more-menu-item-text'],
                  itemClassNames?.text
                )}
              >
                {itemLabel}
              </span>
            </>
          );

          return (
            <Menu.Item
              key={item.key ?? index}
              disabled={disabled}
              render={render}
            />
          );
        })}
      </Menu.Content>
    </Menu>
  );
}

SidebarMore.displayName = 'Sidebar.More';
