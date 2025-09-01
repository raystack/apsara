'use client';

import { Menu, MenuProps, useMenuContext } from '@ariakit/react';
import { Combobox, ComboboxList } from '@ariakit/react';
import { cx } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { ElementRef, forwardRef, useRef } from 'react';
import { useDropdownContext } from './dropdown-menu-root';
import styles from './dropdown-menu.module.css';
import { WithAsChild } from './types';

export interface MenuContentProps extends WithAsChild<MenuProps> {
  searchPlaceholder?: string;
}

export const DropdownMenuContent = forwardRef<
  ElementRef<typeof Menu>,
  MenuContentProps
>(
  (
    { className, children, asChild, searchPlaceholder = 'Search...', ...props },
    ref
  ) => {
    const menu = useMenuContext();
    const { autocomplete } = useDropdownContext();
    const isSubMenu = !!menu?.parent;
    const comboboxRef = useRef<HTMLInputElement>(null);

    return (
      <Menu
        ref={ref}
        modal
        portal
        portalElement={
          typeof window === 'undefined' ? null : window?.document?.body
        }
        unmountOnHide
        gutter={isSubMenu ? 2 : 4}
        className={cx(
          styles.content,
          autocomplete && styles.comboboxContainer,
          className
        )}
        render={asChild ? <Slot.Root /> : undefined}
        {...props}
      >
        {autocomplete ? (
          <>
            <Combobox
              ref={comboboxRef}
              placeholder={searchPlaceholder}
              className={styles.comboboxInput}
              autoSelect
              onPointerEnter={e => {
                if (document && document.activeElement !== comboboxRef.current)
                  comboboxRef.current?.focus();
              }}
            />
            <ComboboxList className={styles.comboboxContent}>
              {children}
            </ComboboxList>
          </>
        ) : (
          children
        )}
      </Menu>
    );
  }
);
