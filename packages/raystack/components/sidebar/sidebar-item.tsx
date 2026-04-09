'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ComponentProps, ReactElement, ReactNode, useContext } from 'react';
import { Menu } from '../menu';
import { Tooltip } from '../tooltip';
import styles from './sidebar.module.css';
import { SidebarLeadingVisual } from './sidebar-leading-visual';
import { useSidebarMoreContext } from './sidebar-more-context';
import { SidebarContext } from './sidebar-root';

export interface SidebarItemProps extends ComponentProps<'a'> {
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

export function SidebarItem({
  classNames,
  leadingIcon,
  children,
  active,
  disabled,
  as = <a />,
  ...props
}: SidebarItemProps) {
  const { isCollapsed, hideCollapsedItemTooltip } = useContext(SidebarContext);
  const sidebarMoreContext = useSidebarMoreContext();
  const insideSidebarMore = !!sidebarMoreContext?.isInsideSidebarMore;

  const shouldShowFallback =
    leadingIcon == undefined &&
    (isCollapsed || insideSidebarMore) &&
    typeof children === 'string' &&
    children.length > 0;

  const menuChildren = (
    <>
      <SidebarLeadingVisual
        leadingIcon={!shouldShowFallback ? leadingIcon : undefined}
        fallbackText={shouldShowFallback ? children : undefined}
        className={classNames?.leadingIcon}
        render={<span />}
      />
      <span className={cx(styles['more-menu-item-text'], classNames?.text)}>
        {children}
      </span>
    </>
  );

  const sidebarChildren = (
    <>
      <SidebarLeadingVisual
        leadingIcon={!shouldShowFallback ? leadingIcon : undefined}
        fallbackText={shouldShowFallback ? children : undefined}
        className={classNames?.leadingIcon}
      />
      {!isCollapsed && (
        <span className={cx(styles['nav-text'], classNames?.text)}>
          {children}
        </span>
      )}
    </>
  );

  const menuContent = useRender({
    defaultTagName: 'a',
    render: as,
    props: mergeProps<'a'>(
      {
        className: cx(
          styles['more-menu-item'],
          classNames?.root,
          sidebarMoreContext?.menuItemClassName
        ),
        'data-active': active,
        'data-disabled': disabled,
        'aria-current': active ? 'page' : undefined,
        'aria-disabled': disabled,
        children: menuChildren
      } as useRender.ComponentProps<'a'>,
      props
    )
  });

  const content = useRender({
    defaultTagName: 'a',
    render: as,
    props: mergeProps<'a'>(
      {
        className: cx(styles['nav-item'], classNames?.root),
        'data-active': active,
        'data-disabled': disabled,
        role: 'listitem',
        'aria-current': active ? 'page' : undefined,
        'aria-disabled': disabled,
        ...(isCollapsed && typeof children === 'string'
          ? { 'aria-label': children }
          : {}),
        children: sidebarChildren
      } as useRender.ComponentProps<'a'>,
      props
    )
  });

  if (insideSidebarMore) {
    return <Menu.Item disabled={disabled} render={menuContent} />;
  }

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

SidebarItem.displayName = 'Sidebar.Item';
