'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { forwardRef } from 'react';
import { TriangleRightIcon } from '~/icons';
import { Cell, CellBaseProps } from './cell';
import { useMenuContext } from './menu-root';
import { getMatch } from './utils';

export interface MenuTriggerProps extends MenuPrimitive.Trigger.Props {
  stopPropagation?: boolean;
}

export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ children, stopPropagation = true, onClick, ...props }, ref) => {
    return (
      <MenuPrimitive.Trigger
        ref={ref}
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
);
MenuTrigger.displayName = 'Menu.Trigger';

export interface MenuSubTriggerProps
  extends MenuPrimitive.SubmenuTrigger.Props,
    CellBaseProps {
  value?: string;
}

export const MenuSubTrigger = forwardRef<HTMLDivElement, MenuSubTriggerProps>(
  (
    {
      children,
      value,
      trailingIcon = <TriangleRightIcon />,
      leadingIcon,
      ...props
    },
    ref
  ) => {
    const { parent, inputRef } = useMenuContext();

    if (
      parent?.shouldFilter &&
      !getMatch(value, children, parent?.inputValue)
    ) {
      return null;
    }

    const cell = <Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />;
    return (
      <MenuPrimitive.SubmenuTrigger
        ref={ref}
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
);
MenuSubTrigger.displayName = 'Menu.SubTrigger';
