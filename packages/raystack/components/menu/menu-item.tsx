'use client';

import {
  Autocomplete as AutocompletePrimitive,
  Menu as MenuPrimitive
} from '@base-ui/react';
import { forwardRef } from 'react';
import { Cell, CellBaseProps } from './cell';
import { useMenuContext } from './menu-root';
import { getMatch } from './utils';

export interface MenuItemProps extends MenuPrimitive.Item.Props, CellBaseProps {
  value?: string;
}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  ({ children, value, leadingIcon, trailingIcon, render, ...props }, ref) => {
    const { autocomplete, searchValue, shouldFilter } = useMenuContext();

    const cell = render ?? (
      <Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />
    );
    const commonProps = {
      ref,
      render: render ?? (
        <Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />
      ),
      children
    };

    // In auto mode, hide items that don't match the search value
    if (shouldFilter && !getMatch(value, children, searchValue)) {
      return null;
    }

    if (autocomplete) {
      return (
        <AutocompletePrimitive.Item value={value} {...commonProps} {...props} />
      );
    }

    return (
      <MenuPrimitive.Item
        {...commonProps}
        {...props}
        // render={
        //   autocomplete ? (
        //     <AutocompletePrimitive.Item value={value} render={cell} />
        //   ) : (
        //     cell
        //   )
        // }
      />
    );
  }
);
MenuItem.displayName = 'Menu.Item';
