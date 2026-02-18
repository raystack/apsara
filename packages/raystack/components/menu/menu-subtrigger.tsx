'use client';

import {
  Autocomplete as AutocompletePrimitive,
  Combobox
} from '@base-ui/react';
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
    //       // ref={ref}
    //       value={value}
    //       render={
    //         <Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />
    //       }
    //       // render={
    //       //   <MenuPrimitive.Item
    //       //     render={
    //       //       <Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />
    //       //     }
    //       //   />
    //       // }
    //       // aria-selected={false}
    //       // data-selected={undefined}
    //       onKeyDown={e => {
    //         console.log('sub trigger key down', e.key);
    //         // if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    //         //   e.stopPropagation();
    //         //   e.preventDefault();
    //         // }
    //       }}
    //     >
    //       {children}
    //     </Combobox.Item>
    //   );
    // }

    // return (
    //   <MenuPrimitive.SubmenuTrigger
    //     ref={ref}
    //     render={<Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />}
    //   >
    //     {children}
    //   </MenuPrimitive.SubmenuTrigger>
    // );

    return (
      <MenuPrimitive.SubmenuTrigger
        ref={ref}
        render={
          parent?.autocomplete ? (
            <AutocompletePrimitive.Item
              value={value}
              render={
                <Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />
              }
              onKeyDown={e => {
                console.log('sub trigger key down', e.key);
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                  e.stopPropagation();
                  e.preventDefault();
                }
              }}
            />
          ) : (
            <Cell leadingIcon={leadingIcon} trailingIcon={trailingIcon} />
          )
        }
        {...props}
        role={parent?.autocomplete ? 'option' : undefined}
        // tabIndex={undefined}
        // data-selected={undefined}
        // onFocus={e => {
        //   console.log('sub trigger focus');
        //   // e.stopPropagation();
        //   // e.preventDefault();
        //   // e.preventBaseUIHandler();
        // }}
        // onBlur={e => {
        //   console.log('sub trigger blur');
        //   // e.stopPropagation();
        //   // e.preventDefault();
        //   // e.preventBaseUIHandler();
        // }}
      >
        {children}
      </MenuPrimitive.SubmenuTrigger>
    );
  }
);
MenuSubTrigger.displayName = 'Menu.SubTrigger';
