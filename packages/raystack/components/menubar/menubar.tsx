'use client';

import { Menubar as MenubarPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { createContext, useContext } from 'react';
import styles from './menubar.module.css';

const MenubarContext = createContext(false);

export function useMenubarContext() {
  return useContext(MenubarContext);
}

function MenubarRoot({ className, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarContext value={true}>
      <MenubarPrimitive className={cx(styles.menubar, className)} {...props} />
    </MenubarContext>
  );
}
MenubarRoot.displayName = 'Menubar';

export const Menubar = MenubarRoot;
