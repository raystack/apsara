'use client';

import { MouseEvent, ReactNode, useCallback } from 'react';
import { PanelLeftIcon } from '~/icons/generated';
import { IconButton, IconButtonProps } from '../icon-button/icon-button';
import { useSidebar } from './sidebar-root';

export interface SidebarTriggerProps extends Omit<IconButtonProps, 'children'> {
  /** Icon rendered inside the trigger.
   * @default <PanelLeftIcon />
   */
  children?: ReactNode;
}

export function SidebarTrigger({
  onClick,
  children,
  'aria-label': ariaLabel,
  disabled,
  ...props
}: SidebarTriggerProps) {
  const { open, setOpen, collapsible, sidebarId } = useSidebar();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        setOpen(!open);
      }
    },
    [onClick, open, setOpen]
  );

  return (
    <IconButton
      onClick={handleClick}
      disabled={collapsible === 'none' || disabled}
      aria-label={ariaLabel ?? (open ? 'Collapse sidebar' : 'Expand sidebar')}
      aria-expanded={open}
      aria-controls={sidebarId}
      data-slot='sidebar-trigger'
      {...props}
    >
      {children ?? <PanelLeftIcon />}
    </IconButton>
  );
}

SidebarTrigger.displayName = 'Sidebar.Trigger';
