'use client';

import {
  Autocomplete as AutocompletePrimitive,
  Menu as MenuPrimitive
} from '@base-ui/react';
import { CheckIcon } from '~/icons';
import { Cell, CellBaseProps } from './cell';
import cellStyles from './cell.module.css';
import { stopItemFocus, useMenuItemFilter } from './menu-item';

export interface MenuCheckboxItemProps
  extends MenuPrimitive.CheckboxItem.Props,
    CellBaseProps {
  /** Text used to match the search value. Defaults to the children text. */
  value?: string;
}

/** @remarks Only for internal usage. */
export function CheckboxItemBase({
  slotPrefix,
  children,
  value,
  leadingIcon,
  trailingIcon,
  render,
  ...props
}: MenuCheckboxItemProps & { slotPrefix: string }) {
  const { autocomplete, hidden } = useMenuItemFilter(value, children);

  if (hidden) return null;

  const cell = render ?? (
    <Cell
      indicator={
        <MenuPrimitive.CheckboxItemIndicator
          data-slot={`${slotPrefix}-checkbox-item-indicator`}
          className={cellStyles.indicator}
          keepMounted
        >
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      }
      leadingIcon={leadingIcon}
      trailingIcon={trailingIcon}
    />
  );

  if (autocomplete) {
    return (
      <AutocompletePrimitive.Item
        data-slot={`${slotPrefix}-checkbox-item`}
        value={value}
        disabled={props.disabled}
        render={<MenuPrimitive.CheckboxItem render={cell} {...props} />}
      >
        {children}
      </AutocompletePrimitive.Item>
    );
  }

  return (
    <MenuPrimitive.CheckboxItem
      data-slot={`${slotPrefix}-checkbox-item`}
      render={cell}
      {...props}
      onFocus={stopItemFocus}
    >
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

export function MenuCheckboxItem(props: MenuCheckboxItemProps) {
  return <CheckboxItemBase slotPrefix='menu' {...props} />;
}
MenuCheckboxItem.displayName = 'Menu.CheckboxItem';
