'use client';

import { Menu as MenuPrimitive } from '@base-ui/react';
import { ReactElement } from 'react';
import { Cell, CellBaseProps } from './cell';
import { stopItemFocus } from './menu-item';
import { useMenuContext } from './menu-root';
import { getItemLabel } from './utils';

export interface MenuLinkItemProps
  extends Omit<MenuPrimitive.LinkItem.Props, 'render'>,
    CellBaseProps {
  /** Extra text to match in a searchable menu, along with the children text. */
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
      label={autocomplete ? getItemLabel(value, children) : undefined}
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
