'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import {
  ComponentProps,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { Menu } from '../menu';
import { Tooltip } from '../tooltip';
import styles from './sidebar.module.css';
import { SidebarLeadingVisual } from './sidebar-leading-visual';
import { useInsideSidebarMore } from './sidebar-more-context';
import { SidebarPopupContext, useSidebarSafe } from './sidebar-root';

export interface SidebarItemProps extends ComponentProps<'a'> {
  leadingIcon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  render?: ReactElement;
  /** @deprecated Every key here has an equivalent `[data-slot]` — see the Slots table in the Sidebar docs. */
  classNames?: {
    /** @deprecated Use `[data-slot="sidebar-item"]` instead. */
    root?: string;
    /** @deprecated Use `[data-slot="sidebar-leading-icon"]` instead. */
    leadingIcon?: string;
    /** @deprecated Use `[data-slot="sidebar-item-text"]` instead. */
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
  const { isCollapsed, position, hideItemTooltips } = useSidebarSafe();
  const onPopupOpenChange = useContext(SidebarPopupContext);
  const insideSidebarMore = useInsideSidebarMore();
  const textRef = useRef<HTMLSpanElement>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  // Open away from the sidebar's edge, like the More menu and handle tooltip.
  const tooltipSide = position === 'left' ? 'right' : 'left';

  // Report to the sidebar so an open tooltip holds a hover peek. An effect
  // (not the onOpenChange handler) so unmounting mid-tooltip still
  // decrements the sidebar's open-popup count.
  useEffect(() => {
    if (!tooltipOpen) return;
    onPopupOpenChange(true);
    return () => onPopupOpenChange(false);
  }, [tooltipOpen, onPopupOpenChange]);

  const shouldShowFallback =
    leadingIcon == null &&
    (isCollapsed || insideSidebarMore) &&
    typeof children === 'string' &&
    children.length > 0;

  const itemChildren = (
    <>
      <SidebarLeadingVisual
        leadingIcon={!shouldShowFallback ? leadingIcon : undefined}
        fallbackText={shouldShowFallback ? children : undefined}
        className={classNames?.leadingIcon}
        render={insideSidebarMore ? <span /> : undefined}
      />
      {/* In the sidebar, kept mounted so it can collapse with the sidebar
          (max-width → 0) instead of popping out; CSS hides it when closed. */}
      <span
        ref={textRef}
        className={cx(
          insideSidebarMore
            ? styles['more-menu-item-text']
            : styles['nav-text'],
          classNames?.text
        )}
        data-slot='sidebar-item-text'
      >
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
        'data-slot': 'sidebar-item',
        'data-active': active ? 'true' : undefined,
        'data-disabled': disabled ? 'true' : undefined,
        'aria-current': active ? 'page' : undefined,
        'aria-disabled': disabled || undefined,
        ...(!insideSidebarMore ? { role: 'listitem' } : {}),
        ...(isCollapsed && typeof children === 'string' && !insideSidebarMore
          ? { 'aria-label': children }
          : {}),
        children: itemChildren
      } as useRender.ComponentProps<'a'>,
      props
    )
  });

  if (insideSidebarMore) {
    return <Menu.Item disabled={disabled} render={content} />;
  }

  // One prop opts out of every tooltip the library adds to items — the
  // collapsed label tooltip and the expanded clipped-label tooltip.
  if (hideItemTooltips) return content;

  // One always-controlled Tooltip for both states (switching a mounted
  // Tooltip between controlled and uncontrolled triggers a React warning):
  // collapsed items always show it; expanded items only when the label is
  // actually clipped at its max-width.
  return (
    <Tooltip
      open={tooltipOpen}
      onOpenChange={open => {
        const el = textRef.current;
        setTooltipOpen(
          open &&
            (isCollapsed || (el != null && el.scrollWidth > el.clientWidth))
        );
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
