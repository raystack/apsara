'use client';

import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { cx } from 'class-variance-authority';
import { KeyboardEvent } from 'react';
import { ChevronRightIcon } from '~/icons';
import { Button } from '../button';
import { useMenubarContext } from '../menubar/menubar';
import { Cell, CellBaseProps } from './cell';
import styles from './menu.module.css';
import { useMenuContext } from './menu-root';
import { getItemLabel } from './utils';

export interface MenuTriggerProps extends MenuPrimitive.Trigger.Props {
  stopPropagation?: boolean;
}

/**
 * Base UI does not send typed keys from a menubar trigger to the search input,
 * and a menu opened by hover leaves focus on the trigger.
 */
const focusSearchInput = (e: KeyboardEvent<HTMLElement>) => {
  if (e.key.length !== 1 || e.key === ' ' || e.ctrlKey || e.metaKey || e.altKey)
    return;
  const trigger = e.currentTarget;
  if (trigger.getAttribute('aria-expanded') !== 'true') return;
  const popupId = trigger.getAttribute('aria-controls');
  if (!popupId) return;
  const input = trigger.ownerDocument
    .getElementById(popupId)
    ?.querySelector<HTMLInputElement>('[data-slot="menu-search-input"]');
  // The key's default action types into the element that has focus.
  input?.focus({ preventScroll: true });
};

export function MenuTrigger({
  children,
  stopPropagation = true,
  onClick,
  onKeyDown,
  render,
  ...props
}: MenuTriggerProps) {
  const inMenubarContext = useMenubarContext();
  const { autocomplete } = useMenuContext();
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
      onKeyDown={e => {
        if (inMenubarContext && autocomplete) focusSearchInput(e);
        onKeyDown?.(e);
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
  trailingIcon = <ChevronRightIcon />,
  leadingIcon,
  ...props
}: MenuSubTriggerProps) {
  const { parent } = useMenuContext();

  return (
    <MenuPrimitive.SubmenuTrigger
      render={<Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />}
      label={parent?.autocomplete ? getItemLabel(value, children) : undefined}
      {...props}
      data-slot='menu-subtrigger'
    >
      {children}
    </MenuPrimitive.SubmenuTrigger>
  );
}
MenuSubTrigger.displayName = 'Menu.SubmenuTrigger';
