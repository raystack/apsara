'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import {
  ComponentProps,
  ReactElement,
  ReactNode,
  useRef,
  useState
} from 'react';
import { Menu } from '../menu';
import { Tooltip } from '../tooltip';
import styles from './sidebar.module.css';
import { SidebarLeadingVisual } from './sidebar-leading-visual';
import { useSidebarMoreContext } from './sidebar-more-context';
import { useSidebar } from './sidebar-root';

export interface SidebarItemProps extends ComponentProps<'a'> {
  leadingIcon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  render?: ReactElement;
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
  render = <a />,
  ...props
}: SidebarItemProps) {
  const { isCollapsed, hideCollapsedItemTooltip } = useSidebar();
  const sidebarMoreContext = useSidebarMoreContext();
  const insideSidebarMore = !!sidebarMoreContext?.isInsideSidebarMore;
  const textRef = useRef<HTMLSpanElement>(null);
  const [truncationTooltipOpen, setTruncationTooltipOpen] = useState(false);

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
      {/* Kept mounted so it can collapse with the sidebar (max-width → 0)
          instead of popping out; CSS hides it when closed. */}
      <span ref={textRef} className={cx(styles['nav-text'], classNames?.text)}>
        {children}
      </span>
    </>
  );

  const content = useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      {
        className: cx(
          insideSidebarMore ? styles['more-menu-item'] : styles['nav-item'],
          classNames?.root
        ),
        'data-active': active,
        'data-disabled': disabled,
        'aria-current': active ? 'page' : undefined,
        'aria-disabled': disabled,
        ...(!insideSidebarMore ? { role: 'listitem' } : {}),
        ...(isCollapsed && typeof children === 'string' && !insideSidebarMore
          ? { 'aria-label': children }
          : {}),
        children: insideSidebarMore ? menuChildren : sidebarChildren
      } as useRender.ComponentProps<'a'>,
      props
    )
  });

  if (insideSidebarMore) {
    return <Menu.Item disabled={disabled} render={content} />;
  }

  if (isCollapsed) {
    if (hideCollapsedItemTooltip) return content;
    return (
      <Tooltip>
        <Tooltip.Trigger render={content} />
        <Tooltip.Content side='right' sideOffset={16}>
          {children}
        </Tooltip.Content>
      </Tooltip>
    );
  }

  // Expanded: the label truncates at a fixed max-width, so surface the full
  // text in a tooltip — but only when it is actually clipped.
  return (
    <Tooltip
      open={truncationTooltipOpen}
      onOpenChange={open => {
        const el = textRef.current;
        setTruncationTooltipOpen(
          open && el != null && el.scrollWidth > el.clientWidth
        );
      }}
    >
      <Tooltip.Trigger render={content} />
      <Tooltip.Content side='right' sideOffset={16}>
        {children}
      </Tooltip.Content>
    </Tooltip>
  );
}

SidebarItem.displayName = 'Sidebar.Item';
