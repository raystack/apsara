'use client';

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react';
import { ChevronRightIcon } from '~/icons';
import { Cell, CellBaseProps } from '../menu/cell';
import { useMenuContext } from '../menu/menu-root';

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
  value?: string;
}

export const ContextMenuSubTrigger = ({
  children,
  value,
  trailingIcon = <ChevronRightIcon />,
  leadingIcon,
  ...props
}: ContextMenuSubTriggerProps) => {
  const { parent } = useMenuContext();

  return (
    <ContextMenuPrimitive.SubmenuTrigger
      render={<Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />}
      label={parent?.autocomplete ? value : undefined}
      {...props}
      data-slot='menu-subtrigger'
    >
      {children}
    </ContextMenuPrimitive.SubmenuTrigger>
  );
};
ContextMenuSubTrigger.displayName = 'ContextMenu.SubTrigger';
