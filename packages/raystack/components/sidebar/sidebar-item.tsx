'use client';

import { cx } from 'class-variance-authority';
import {
  ComponentPropsWithoutRef,
  ReactElement,
  ReactNode,
  cloneElement,
  forwardRef,
  useContext
} from 'react';
import { Avatar } from '../avatar';
import { Flex } from '../flex';
import { Tooltip } from '../tooltip';
import { SidebarContext } from './sidebar-root';
import styles from './sidebar.module.css';

export interface SidebarItemProps extends ComponentPropsWithoutRef<'a'> {
  leadingIcon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  as?: ReactElement;
  classNames?: {
    root?: string;
    leadingIcon?: string;
    text?: string;
  };
}

export const SidebarItem = forwardRef<HTMLAnchorElement, SidebarItemProps>(
  (
    {
      classNames,
      leadingIcon,
      children,
      active,
      disabled,
      as = <a />,
      ...props
    },
    ref
  ) => {
    const { isCollapsed, hideCollapsedItemTooltip } =
      useContext(SidebarContext);

    const shouldShowFallback =
      leadingIcon == undefined &&
      isCollapsed &&
      typeof children === 'string' &&
      children.length > 0;

    const content = cloneElement(
      as,
      {
        ref,
        className: cx(styles['nav-item'], classNames?.root),
        'data-active': active,
        'data-disabled': disabled,
        role: 'menuitem',
        'aria-current': active ? 'page' : undefined,
        'aria-disabled': disabled,
        ...props
      },
      <>
        <Flex
          align='center'
          gap={3}
          className={cx(styles['nav-leading-icon'], classNames?.leadingIcon)}
          aria-hidden='true'
        >
          {shouldShowFallback ? (
            <Avatar
              size={1}
              variant='soft'
              color='neutral'
              fallback={children[0].toUpperCase()}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            leadingIcon
          )}
        </Flex>
        {!isCollapsed && <span className={styles['nav-text']}>{children}</span>}
      </>
    );

    if (isCollapsed && !hideCollapsedItemTooltip) {
      return (
        <Tooltip message={children} side='right'>
          {content}
        </Tooltip>
      );
    }

    return content;
  }
);

SidebarItem.displayName = 'Sidebar.Item';
