'use client';

import { Combobox } from '@base-ui/react';
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
    // if (parent?.autocomplete) {
    //   return (
    //     <Combobox.Item
    //       ref={ref}
    //       value={value}
    //       render={
    //         <MenuPrimitive.SubmenuTrigger
    //           render={
    //             <Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />
    //           }
    //         />
    //       }
    //       {...props}
    //     >
    //       {children}
    //     </Combobox.Item>
    //   );
    // }
    return (
      <MenuPrimitive.SubmenuTrigger
        ref={ref}
        render={
          parent?.autocomplete ? (
            <Combobox.Item
              value={value}
              render={
                <Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />
              }
            />
          ) : (
            <Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />
          )
        }
        {...props}
      >
        {children}
      </MenuPrimitive.SubmenuTrigger>
    );
  }
);
MenuSubTrigger.displayName = 'Menu.SubTrigger';
