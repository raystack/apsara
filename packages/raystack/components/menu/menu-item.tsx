'use client';

import {
  Autocomplete as AutocompletePrimitive,
  Menu as MenuPrimitive
} from '@base-ui/react';
import { Cell, CellBaseProps } from './cell';
import { useMenuContext } from './menu-root';
import { getMatch } from './utils';

export interface MenuItemProps extends MenuPrimitive.Item.Props, CellBaseProps {
  value?: string;
}

export function MenuItem({
  children,
  value,
  leadingIcon,
  trailingIcon,
  render,
  ...props
}: MenuItemProps) {
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
        value={value}
        render={<MenuPrimitive.Item render={cell} />}
        {...props}
      >
        {children}
      </AutocompletePrimitive.Item>
    );
  }

  return (
    <MenuPrimitive.Item
      render={cell}
      {...props}
      onFocus={e => {
        e.stopPropagation();
        e.preventDefault();
        e.preventBaseUIHandler();
      }}
    >
      {children}
    </MenuPrimitive.Item>
  );
}
MenuItem.displayName = 'Menu.Item';
