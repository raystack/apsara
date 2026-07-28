'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import {
  ComponentProps,
  ReactElement,
  ReactNode,
  useContext,
  useRef,
  useState
} from 'react';
import { Menu } from '../menu';
import { Tooltip } from '../tooltip';
import styles from './sidebar.module.css';
import { SidebarLeadingVisual } from './sidebar-leading-visual';
import { useSidebarMoreContext } from './sidebar-more-context';
import { SidebarPopupContext, useSidebarSafe } from './sidebar-root';

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
  const { isCollapsed, position, hideCollapsedItemTooltip } = useSidebarSafe();
  const onPopupOpenChange = useContext(SidebarPopupContext);
  const sidebarMoreContext = useSidebarMoreContext();
  const insideSidebarMore = !!sidebarMoreContext?.isInsideSidebarMore;
  const textRef = useRef<HTMLSpanElement>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  // Open away from the sidebar's edge, like the More menu and handle tooltip.
  const tooltipSide = position === 'left' ? 'right' : 'left';

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

  // One prop opts out of every tooltip the library adds to items — the
  // collapsed label tooltip and the expanded clipped-label tooltip.
  if (hideCollapsedItemTooltip) return content;

  // One always-controlled Tooltip for both states (switching a mounted
  // Tooltip between controlled and uncontrolled triggers a React warning):
  // collapsed items always show it; expanded items only when the label is
  // actually clipped at its max-width.
  return (
    <Tooltip
      open={tooltipOpen}
      onOpenChange={open => {
        const el = textRef.current;
        const next =
          open &&
          (isCollapsed || (el != null && el.scrollWidth > el.clientWidth));
        // Report to the sidebar so an open tooltip holds a hover peek.
        if (next !== tooltipOpen) onPopupOpenChange(next);
        setTooltipOpen(next);
      }}
    >
      <Tooltip.Trigger render={content} />
      <Tooltip.Content side={tooltipSide} sideOffset={16}>
        {children}
      </Tooltip.Content>
    </Tooltip>
  );
}

SidebarItem.displayName = 'Sidebar.Item';
