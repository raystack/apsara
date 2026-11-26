'use client';

import { Menu as MenuPrimitive } from '@base-ui/react';
import { CheckIcon } from '~/icons';
import { Cell, CellBaseProps } from './cell';
import cellStyles from './cell.module.css';
import { stopItemFocus } from './menu-item';
import { useMenuContext } from './menu-root';

export interface MenuCheckboxItemProps
  extends MenuPrimitive.CheckboxItem.Props,
    CellBaseProps {
  /** @deprecated Has no effect. Use `label` to set the search text. */
  value?: string;
}

/** @remarks Only for internal usage. */
export function CheckboxItemBase({
  slotPrefix,
  children,
  value: _value,
  leadingIcon,
  trailingIcon,
  render,
  ...props
}: MenuCheckboxItemProps & { slotPrefix: string }) {
  const { autocomplete } = useMenuContext();

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

  return (
    <MenuPrimitive.CheckboxItem
      data-slot={`${slotPrefix}-checkbox-item`}
      render={cell}
      {...props}
      onFocus={autocomplete ? props.onFocus : stopItemFocus}
    >
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

export function MenuCheckboxItem(props: MenuCheckboxItemProps) {
  return <CheckboxItemBase slotPrefix='menu' {...props} />;
}
MenuCheckboxItem.displayName = 'Menu.CheckboxItem';
