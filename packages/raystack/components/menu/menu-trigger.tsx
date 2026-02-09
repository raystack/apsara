'use client';

import { Menu as MenuPrimitive } from '@base-ui/react';
import { forwardRef } from 'react';

export interface MenuTriggerProps extends MenuPrimitive.Trigger.Props {
  stopPropagation?: boolean;
}

export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ children, stopPropagation = true, onClick, ...props }, ref) => {
    console.log('menu trigger');
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
