'use client';

import {
  Autocomplete as AutocompletePrimitive,
  Menu as MenuPrimitive
} from '@base-ui/react';
import { ReactNode } from 'react';
import { useRegisterItem } from '~/shared/item-count';
import { Cell, CellBaseProps } from './cell';
import { useMenuContext } from './menu-root';
import { getMatch } from './utils';

/**
 * Hides the item when it does not match the search value (in auto mode),
 * and counts it for `Menu.EmptyState` and `Menu.Status` when it shows.
 * @remarks Only for internal usage.
 */
export function useMenuItemFilter(value: unknown, children: ReactNode) {
  const { autocomplete, inputValue, shouldFilter } = useMenuContext();
  const hidden =
    shouldFilter &&
    !getMatch(
      typeof value === 'string' ? value : undefined,
      children,
      inputValue
    );
  useRegisterItem(!hidden);
  return { autocomplete, hidden };
}

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
  const { autocomplete, hidden } = useMenuItemFilter(value, children);

  if (hidden) return null;

  const cell = render ?? (
    <Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />
  );

  if (autocomplete) {
    return (
      <AutocompletePrimitive.Item
        data-slot='menu-item'
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
      data-slot='menu-item'
      render={cell}
      {...props}
      onFocus={stopItemFocus}
    >
      {children}
    </MenuPrimitive.Item>
  );
}
MenuItem.displayName = 'Menu.Item';
