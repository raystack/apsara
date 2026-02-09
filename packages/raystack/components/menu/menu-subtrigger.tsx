'use client';

import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { forwardRef } from 'react';
import { TriangleRightIcon } from '~/icons';
import { Cell, CellBaseProps } from './cell';
import { useMenuContext } from './menu-root';
import { getMatch } from './utils';

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
    const { parent } = useMenuContext();

    if (
      parent?.shouldFilter &&
      !getMatch(value, children, parent?.searchValue)
    ) {
      return null;
    }

    return (
      <MenuPrimitive.SubmenuTrigger
        ref={ref}
        render={<Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />}
        {...props}
      >
        {children}
      </MenuPrimitive.SubmenuTrigger>
    );
  }
);
MenuSubTrigger.displayName = 'Menu.SubTrigger';
