'use client';

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react';
import type { ReactNode } from 'react';
import { ChevronRightIcon } from '~/icons';
import { Cell, CellBaseProps } from '../menu/cell';

export interface ContextMenuTriggerProps
  extends ContextMenuPrimitive.Trigger.Props {}

export const ContextMenuTrigger = ({
  children,
  ...props
}: ContextMenuTriggerProps) => {
  return (
    <ContextMenuPrimitive.Trigger data-slot='context-menu-trigger' {...props}>
      {children}
    </ContextMenuPrimitive.Trigger>
  );
};
ContextMenuTrigger.displayName = 'ContextMenu.Trigger';

export interface ContextMenuSubTriggerProps
  extends ContextMenuPrimitive.SubmenuTrigger.Props,
    CellBaseProps {
  /** @deprecated Has no effect. Use `label` to set the search text. */
  value?: string;
  /** Icon after the trigger text. Defaults to a right chevron. */
  trailingIcon?: ReactNode;
}

export const ContextMenuSubTrigger = ({
  children,
  value: _value,
  trailingIcon = <ChevronRightIcon />,
  leadingIcon,
  ...props
}: ContextMenuSubTriggerProps) => {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      render={<Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />}
      {...props}
      data-slot='menu-subtrigger'
    >
      {children}
    </ContextMenuPrimitive.SubmenuTrigger>
  );
};
ContextMenuSubTrigger.displayName = 'ContextMenu.SubTrigger';
