'use client';

import { Menu as MenuPrimitive } from '@base-ui/react';
import { ReactElement } from 'react';
import { Cell, CellBaseProps } from './cell';
import { stopItemFocus } from './menu-item';
import { useMenuContext } from './menu-root';

export interface MenuLinkItemProps
  extends Omit<MenuPrimitive.LinkItem.Props, 'render'>,
    CellBaseProps {
  /** Text used to match the search value. Defaults to the children text. */
  value?: string;
  /** The link element to render, for example a router link. */
  render?: ReactElement;
}

/** @remarks Only for internal usage. */
export function LinkItemBase({
  slotPrefix,
  children,
  value,
  leadingIcon,
  trailingIcon,
  render = <a />,
  ...props
}: MenuLinkItemProps & { slotPrefix: string }) {
  const { autocomplete } = useMenuContext();

  const cell = (
    <Cell
      render={render}
      leadingIcon={leadingIcon}
      trailingIcon={trailingIcon}
    />
  );

  return (
    <MenuPrimitive.LinkItem
      data-slot={`${slotPrefix}-link-item`}
      render={cell}
      label={autocomplete ? value : undefined}
      {...props}
      onFocus={autocomplete ? props.onFocus : stopItemFocus}
    >
      {children}
    </MenuPrimitive.LinkItem>
  );
}

export function MenuLinkItem(props: MenuLinkItemProps) {
  return <LinkItemBase slotPrefix='menu' {...props} />;
}
MenuLinkItem.displayName = 'Menu.LinkItem';
