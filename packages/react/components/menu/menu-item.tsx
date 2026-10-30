'use client';

import { Menu as MenuPrimitive } from '@base-ui/react';
import { Cell, CellBaseProps } from './cell';
import { useMenuContext } from './menu-root';

/**
 * Keeps focus handling out of Base UI for items in a plain menu.
 * @remarks Only for internal usage.
 */
export const stopItemFocus = (e: {
  stopPropagation: () => void;
  preventDefault: () => void;
  preventBaseUIHandler: () => void;
}) => {
  e.stopPropagation();
  e.preventDefault();
  e.preventBaseUIHandler();
};

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
  const { autocomplete } = useMenuContext();

  const cell = render ?? (
    <Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />
  );

  return (
    <MenuPrimitive.Item
      data-slot='menu-item'
      render={cell}
      label={autocomplete ? value : undefined}
      {...props}
      onFocus={autocomplete ? props.onFocus : stopItemFocus}
    >
      {children}
    </MenuPrimitive.Item>
  );
}
MenuItem.displayName = 'Menu.Item';
