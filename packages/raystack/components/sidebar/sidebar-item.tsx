'use client';

import { cx } from 'class-variance-authority';
import {
  ComponentPropsWithoutRef,
  cloneElement,
  forwardRef,
  ReactElement,
  ReactNode,
  useContext
} from 'react';
import { Avatar } from '../avatar';
import { Flex } from '../flex';
import { Tooltip } from '../tooltip';
import styles from './sidebar.module.css';
import { SidebarContext } from './sidebar-root';

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

    const iconProps = {
      align: 'center',
      gap: 3,
      className: cx(styles['nav-leading-icon'], classNames?.leadingIcon),
      'aria-hidden': true
    } as const;

    const content = cloneElement(
      as,
      {
        ref,
        className: cx(styles['nav-item'], classNames?.root),
        'data-active': active,
        'data-disabled': disabled,
        role: 'listitem',
        'aria-current': active ? 'page' : undefined,
        'aria-disabled': disabled,
        ...(isCollapsed && typeof children === 'string'
          ? { 'aria-label': children }
          : {}),
        ...props
      },
      <>
        {shouldShowFallback ? (
          <Flex {...iconProps}>
            <Avatar
              size={1}
              variant='soft'
              color='neutral'
              fallback={children[0].toUpperCase()}
              className={styles['nav-fallback-avatar']}
            />
          </Flex>
        ) : null}
        {!shouldShowFallback && leadingIcon ? (
          <Flex {...iconProps}>{leadingIcon}</Flex>
        ) : null}
        {!isCollapsed && (
          <span className={cx(styles['nav-text'], classNames?.text)}>
            {children}
          </span>
        )}
      </>
    );

    if (isCollapsed && !hideCollapsedItemTooltip) {
      return (
        <Tooltip>
          <Tooltip.Trigger render={content} />
          <Tooltip.Content side='right'>{children}</Tooltip.Content>
        </Tooltip>
      );
    }

    return content;
  }
);

SidebarItem.displayName = 'Sidebar.Item';
