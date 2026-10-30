'use client';

import { Menu as MenuPrimitive } from '@base-ui/react';
import { useControlled } from '@base-ui/utils/useControlled';
import { CheckIcon } from '~/icons';
import { Cell, CellBaseProps } from './cell';
import cellStyles from './cell.module.css';
import { stopItemFocus } from './menu-item';
import { useMenuContext } from './menu-root';

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
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  ...props
}: MenuCheckboxItemProps & { slotPrefix: string }) {
  const { autocomplete } = useMenuContext();
  // The Base UI item renders nothing while filtered out, so the state lives here.
  const [checked, setCheckedUnwrapped] = useControlled({
    controlled: checkedProp,
    default: defaultChecked,
    name: 'MenuCheckboxItem',
    state: 'checked'
  });

  const itemProps = {
    ...props,
    checked,
    onCheckedChange: (
      next: boolean,
      eventDetails: MenuPrimitive.CheckboxItem.ChangeEventDetails
    ) => {
      onCheckedChange?.(next, eventDetails);
      if (eventDetails.isCanceled) return;
      setCheckedUnwrapped(next);
    }
  };

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
      label={autocomplete ? value : undefined}
      {...itemProps}
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
