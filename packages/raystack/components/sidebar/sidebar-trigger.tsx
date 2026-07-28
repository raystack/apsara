'use client';

import { ViewVerticalIcon } from '@radix-ui/react-icons';
import { MouseEvent, ReactNode, useCallback } from 'react';
import { IconButton, IconButtonProps } from '../icon-button/icon-button';
import { useSidebar } from './sidebar-root';

export interface SidebarTriggerProps extends Omit<IconButtonProps, 'children'> {
  /** Icon rendered inside the trigger.
   * @default <ViewVerticalIcon />
   */
  children?: ReactNode;
}

export function SidebarTrigger({
  onClick,
  children,
  'aria-label': ariaLabel,
  ...props
}: SidebarTriggerProps) {
  const { open, setOpen, collapsible } = useSidebar();

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
      disabled={!collapsible}
      aria-label={ariaLabel ?? (open ? 'Collapse sidebar' : 'Expand sidebar')}
      aria-expanded={open}
      {...props}
    >
      {children ?? <ViewVerticalIcon />}
    </IconButton>
  );
}

SidebarTrigger.displayName = 'Sidebar.Trigger';
