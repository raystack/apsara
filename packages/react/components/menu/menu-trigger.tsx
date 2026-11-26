'use client';

import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { cx } from 'class-variance-authority';
import { ChevronRightIcon } from '~/icons';
import { Button } from '../button';
import { useMenubarContext } from '../menubar/menubar';
import { Cell, CellBaseProps } from './cell';
import styles from './menu.module.css';

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
      className={cx(styles.menuBarTrigger, 'rs-menu-trigger')}
    />
  ) : undefined;

  return (
    <MenuPrimitive.Trigger
      data-slot='menu-trigger'
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
  /** @deprecated Has no effect. Use `label` to set the search text. */
  value?: string;
}

export function MenuSubTrigger({
  children,
  value: _value,
  trailingIcon = <ChevronRightIcon />,
  leadingIcon,
  ...props
}: MenuSubTriggerProps) {
  return (
    <MenuPrimitive.SubmenuTrigger
      render={<Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />}
      {...props}
      data-slot='menu-subtrigger'
    >
      {children}
    </MenuPrimitive.SubmenuTrigger>
  );
}
MenuSubTrigger.displayName = 'Menu.SubmenuTrigger';
