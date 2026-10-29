'use client';

import { Menu as MenuPrimitive } from '@base-ui/react';
import { Cell, CellBaseProps } from './cell';
import cellStyles from './cell.module.css';
import { stopItemFocus } from './menu-item';
import { useMenuContext } from './menu-root';

export type MenuRadioGroupProps = MenuPrimitive.RadioGroup.Props;

/** @remarks Only for internal usage. */
export function RadioGroupBase({
  slotPrefix,
  ...props
}: MenuRadioGroupProps & { slotPrefix: string }) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot={`${slotPrefix}-radio-group`}
      {...props}
    />
  );
}

export function MenuRadioGroup(props: MenuRadioGroupProps) {
  return <RadioGroupBase slotPrefix='menu' {...props} />;
}
MenuRadioGroup.displayName = 'Menu.RadioGroup';

export interface MenuRadioItemProps
  extends MenuPrimitive.RadioItem.Props,
    CellBaseProps {}

/** @remarks Only for internal usage. */
export function RadioItemBase({
  slotPrefix,
  children,
  value,
  leadingIcon,
  trailingIcon,
  render,
  ...props
}: MenuRadioItemProps & { slotPrefix: string }) {
  const { autocomplete } = useMenuContext();

  const cell = render ?? (
    <Cell
      indicator={
        <MenuPrimitive.RadioItemIndicator
          data-slot={`${slotPrefix}-radio-item-indicator`}
          className={cellStyles.indicator}
          keepMounted
        >
          <span className={cellStyles.radioDot} />
        </MenuPrimitive.RadioItemIndicator>
      }
      leadingIcon={leadingIcon}
      trailingIcon={trailingIcon}
    />
  );

  return (
    <MenuPrimitive.RadioItem
      data-slot={`${slotPrefix}-radio-item`}
      render={cell}
      value={value}
      {...props}
      onFocus={autocomplete ? props.onFocus : stopItemFocus}
    >
      {children}
    </MenuPrimitive.RadioItem>
  );
}

export function MenuRadioItem(props: MenuRadioItemProps) {
  return <RadioItemBase slotPrefix='menu' {...props} />;
}
MenuRadioItem.displayName = 'Menu.RadioItem';
