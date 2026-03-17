'use client';

import {
  Autocomplete as AutocompletePrimitive,
  ContextMenu as ContextMenuPrimitive
} from '@base-ui/react';
import { forwardRef } from 'react';
import { TriangleRightIcon } from '~/icons';
import { Cell, CellBaseProps } from '../menu/cell';
import { useMenuContext } from '../menu/menu-root';
import { getMatch } from '../menu/utils';

export interface ContextMenuTriggerProps
  extends ContextMenuPrimitive.Trigger.Props {}

export const ContextMenuTrigger = forwardRef<
  HTMLDivElement,
  ContextMenuTriggerProps
>(({ children, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.Trigger ref={ref} {...props}>
      {children}
    </ContextMenuPrimitive.Trigger>
  );
});
ContextMenuTrigger.displayName = 'ContextMenu.Trigger';

export interface ContextMenuSubTriggerProps
  extends ContextMenuPrimitive.SubmenuTrigger.Props,
    CellBaseProps {
  value?: string;
}

export const ContextMenuSubTrigger = forwardRef<
  HTMLDivElement,
  ContextMenuSubTriggerProps
>(
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
      <ContextMenuPrimitive.SubmenuTrigger
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
      </ContextMenuPrimitive.SubmenuTrigger>
    );
  }
);
ContextMenuSubTrigger.displayName = 'ContextMenu.SubTrigger';
