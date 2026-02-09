'use client';

import { MenuButton, MenuButtonProps } from '@ariakit/react';
import { Slot } from 'radix-ui';
import { forwardRef, PointerEvent } from 'react';
import { TriangleRightIcon } from '~/icons';
import { DropdownMenuItem, DropdownMenuItemProps } from './dropdown-menu-item';
import { useDropdownContext } from './dropdown-menu-root';
import { WithAsChild } from './types';
import { getMatch } from './utils';

export interface DropdownMenuTriggerProps extends WithAsChild<MenuButtonProps> {
  stopPropagation?: boolean;
}

export const DropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ children, asChild, stopPropagation = true, onClick, ...props }, ref) => {
  return (
    <MenuButton
      ref={ref}
      render={asChild ? <Slot.Root /> : undefined}
      onClick={(
        e: PointerEvent<HTMLButtonElement> & PointerEvent<HTMLDivElement>
      ) => {
        if (stopPropagation) e.stopPropagation();
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </MenuButton>
  );
});

export interface DropdownMenuTriggerItemProps extends DropdownMenuItemProps {}

/**
 * `TriggerItem` is a helper component that renders a `Trigger` as a `MenuItem`.
 */
export const DropdownMenuTriggerItem = forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerItemProps
>(
  (
    { children, value, trailingIcon = <TriangleRightIcon />, ...props },
    ref
  ) => {
    const { parent } = useDropdownContext();

    if (
      parent?.shouldFilter &&
      !getMatch(value, children, parent?.searchValue)
    ) {
      return null;
    }

    return (
      <MenuButton
        ref={ref}
        render={
          <DropdownMenuItem
            value={value}
            trailingIcon={trailingIcon}
            {...props}
            forceRender={parent?.autocomplete ? 'combobox' : 'auto'}
          />
        }
      >
        {children}
      </MenuButton>
    );
  }
);
