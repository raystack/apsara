'use client';

import {
  Autocomplete as AutocompletePrimitive,
  ContextMenu as ContextMenuPrimitive
} from '@base-ui/react';
import { Cell, CellBaseProps } from '../menu/cell';
import {
  CheckboxItemBase,
  MenuCheckboxItemProps
} from '../menu/menu-checkbox-item';
import { stopItemFocus, useMenuItemFilter } from '../menu/menu-item';
import { LinkItemBase, MenuLinkItemProps } from '../menu/menu-link-item';
import {
  MenuRadioGroupProps,
  MenuRadioItemProps,
  RadioGroupBase,
  RadioItemBase
} from '../menu/menu-radio';

export interface ContextMenuItemProps
  extends ContextMenuPrimitive.Item.Props,
    CellBaseProps {
  value?: string;
}

export const ContextMenuItem = ({
  children,
  value,
  leadingIcon,
  trailingIcon,
  render,
  ...props
}: ContextMenuItemProps) => {
  const { autocomplete, hidden } = useMenuItemFilter(value, children);

  if (hidden) return null;

  const cell = render ?? (
    <Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />
  );

  if (autocomplete) {
    return (
      <AutocompletePrimitive.Item
        data-slot='context-menu-item'
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
      data-slot='context-menu-item'
      render={cell}
      {...props}
      onFocus={stopItemFocus}
    >
      {children}
    </ContextMenuPrimitive.Item>
  );
};
ContextMenuItem.displayName = 'ContextMenu.Item';

export type ContextMenuCheckboxItemProps = MenuCheckboxItemProps;
export const ContextMenuCheckboxItem = (
  props: ContextMenuCheckboxItemProps
) => <CheckboxItemBase slotPrefix='context-menu' {...props} />;
ContextMenuCheckboxItem.displayName = 'ContextMenu.CheckboxItem';

export type ContextMenuRadioGroupProps = MenuRadioGroupProps;
export const ContextMenuRadioGroup = (props: ContextMenuRadioGroupProps) => (
  <RadioGroupBase slotPrefix='context-menu' {...props} />
);
ContextMenuRadioGroup.displayName = 'ContextMenu.RadioGroup';

export type ContextMenuRadioItemProps = MenuRadioItemProps;
export const ContextMenuRadioItem = (props: ContextMenuRadioItemProps) => (
  <RadioItemBase slotPrefix='context-menu' {...props} />
);
ContextMenuRadioItem.displayName = 'ContextMenu.RadioItem';

export type ContextMenuLinkItemProps = MenuLinkItemProps;
export const ContextMenuLinkItem = (props: ContextMenuLinkItemProps) => (
  <LinkItemBase slotPrefix='context-menu' {...props} />
);
ContextMenuLinkItem.displayName = 'ContextMenu.LinkItem';
