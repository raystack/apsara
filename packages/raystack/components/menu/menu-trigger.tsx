'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { TriangleRightIcon } from '~/icons';
import { Button } from '../button';
import { useMenubarContext } from '../menubar/menubar';
import { Cell, CellBaseProps } from './cell';
import styles from './menu.module.css';
import { useMenuContext } from './menu-root';
import { getMatch } from './utils';

export interface MenuTriggerProps extends MenuPrimitive.Trigger.Props {
  stopPropagation?: boolean;
}

export function MenuTrigger({
  children,
  stopPropagation = true,
  onClick,
  render,
  ...props
}: MenuTriggerProps) {
  const inMenubarContext = useMenubarContext();
  const menubarRender = inMenubarContext ? (
    <Button
      variant='text'
      color='neutral'
      size='small'
      className={`${styles.menuBarTrigger} rs-menu-trigger`}
    />
  ) : undefined;

  return (
    <MenuPrimitive.Trigger
      render={render ?? menubarRender}
      onClick={e => {
        if (stopPropagation) e.stopPropagation();
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </MenuPrimitive.Trigger>
  );
}
MenuTrigger.displayName = 'Menu.Trigger';

export interface MenuSubTriggerProps
  extends MenuPrimitive.SubmenuTrigger.Props,
    CellBaseProps {
  value?: string;
}

export function MenuSubTrigger({
  children,
  value,
  trailingIcon = <TriangleRightIcon />,
  leadingIcon,
  ...props
}: MenuSubTriggerProps) {
  const { parent, inputRef } = useMenuContext();

  if (parent?.shouldFilter && !getMatch(value, children, parent?.inputValue)) {
    return null;
  }

  const cell = <Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />;
  return (
    <MenuPrimitive.SubmenuTrigger
      render={
        parent?.autocomplete ? (
          <AutocompletePrimitive.Item
            value={value}
            render={cell}
            onPointerEnter={e => {
              if (document?.activeElement !== parent?.inputRef?.current)
                parent?.inputRef?.current?.focus();
              props?.onPointerEnter?.(e);
            }}
            onKeyDown={e => {
              requestAnimationFrame(() => {
                inputRef?.current?.focus();
              });
              props?.onKeyDown?.(e);
            }}
          />
        ) : (
          cell
        )
      }
      {...props}
      role={parent?.autocomplete ? 'option' : 'menuitem'}
      data-slot='menu-subtrigger'
    >
      {children}
    </MenuPrimitive.SubmenuTrigger>
  );
}
MenuSubTrigger.displayName = 'Menu.SubmenuTrigger';
