'use client';

import {
  Autocomplete as AutocompletePrimitive,
  ContextMenu as ContextMenuPrimitive
} from '@base-ui/react';
import { forwardRef } from 'react';
import { Cell, CellBaseProps } from '../menu/cell';
import { useMenuContext } from '../menu/menu-root';
import { getMatch } from '../menu/utils';

export interface ContextMenuItemProps
  extends ContextMenuPrimitive.Item.Props,
    CellBaseProps {
  value?: string;
}

export const ContextMenuItem = forwardRef<HTMLDivElement, ContextMenuItemProps>(
  ({ children, value, leadingIcon, trailingIcon, render, ...props }, ref) => {
    const { autocomplete, inputValue, shouldFilter } = useMenuContext();

    const cell = render ?? (
      <Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />
    );

    // In auto mode, hide items that don't match the search value
    if (shouldFilter && !getMatch(value, children, inputValue)) {
      return null;
    }

    if (autocomplete) {
      return (
        <AutocompletePrimitive.Item
          ref={ref}
          value={value}
          render={<ContextMenuPrimitive.Item render={cell} />}
          {...props}
        >
          {children}
        </AutocompletePrimitive.Item>
      );
    }

    return (
      <ContextMenuPrimitive.Item
        ref={ref}
        render={cell}
        {...props}
        onFocus={e => {
          e.stopPropagation();
          e.preventDefault();
          e.preventBaseUIHandler();
        }}
      >
        {children}
      </ContextMenuPrimitive.Item>
    );
  }
);
ContextMenuItem.displayName = 'ContextMenu.Item';
