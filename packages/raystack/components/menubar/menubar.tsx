'use client';

import { Menubar as MenubarPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { createContext, ElementRef, forwardRef, useContext } from 'react';
import styles from './menubar.module.css';

const MenubarContext = createContext(false);

export function useMenubarContext() {
  return useContext(MenubarContext);
}

const MenubarRoot = forwardRef<
  ElementRef<typeof MenubarPrimitive>,
  MenubarPrimitive.Props
>(({ className, ...props }, ref) => (
  <MenubarContext.Provider value={true}>
    <MenubarPrimitive
      ref={ref}
      className={cx(styles.menubar, className)}
      {...props}
    />
  </MenubarContext.Provider>
));
MenubarRoot.displayName = 'Menubar';

export const Menubar = MenubarRoot;
