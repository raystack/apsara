'use client';

import { Menu, MenuProps, useMenuContext } from '@ariakit/react';
import { Combobox, ComboboxList } from '@ariakit/react';
import { cx } from 'class-variance-authority';
import { Slot, VisuallyHidden } from 'radix-ui';
import { ElementRef, forwardRef, useEffect, useRef, useState } from 'react';
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
    const visuallyHiddenRef = useRef<HTMLDivElement>(null);
    const [isInsideRadixDialog, setIsInsideRadixDialog] = useState(false);

    /*
     * This is a workaround to fix focus lock issue when the dropdown menu is inside a Radix Dialog.
     * TODO: Use Radix.Popover for the dropdown popover
     */
    useEffect(() => {
      setIsInsideRadixDialog(
        !!visuallyHiddenRef.current?.closest("[role='dialog']")
      );
    }, []);

    return (
      <>
        <VisuallyHidden.Root ref={visuallyHiddenRef} aria-hidden='true' />
        <Menu
          ref={ref}
          modal={!isInsideRadixDialog}
          portal={!isInsideRadixDialog}
          portalElement={
            typeof window === 'undefined' || isInsideRadixDialog
              ? null
              : window?.document?.body
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
                  if (
                    document &&
                    document.activeElement !== comboboxRef.current
                  )
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
      </>
    );
  }
);
