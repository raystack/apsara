'use client';

import {
  Combobox as ComboboxPrimitive,
  Menu as MenuPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { forwardRef, useRef } from 'react';
import styles from './menu.module.css';
import { useMenuContext } from './menu-root';

export interface MenuContentProps extends MenuPrimitive.Popup.Props {
  searchPlaceholder?: string;
  sideOffset?: number;
  side?: MenuPrimitive.Positioner.Props['side'];
  align?: MenuPrimitive.Positioner.Props['align'];
}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  (
    {
      className,
      children,
      searchPlaceholder = 'Search...',
      sideOffset = 4,
      side,
      align,
      ...props
    },
    ref
  ) => {
    const { autocomplete, searchValue, onSearch } = useMenuContext();
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          sideOffset={sideOffset}
          side={side}
          align={align}
        >
          <MenuPrimitive.Popup
            ref={ref}
            className={cx(
              styles.content,
              autocomplete && styles.comboboxContainer,
              className
            )}
            {...props}
            role={autocomplete ? 'dialog' : undefined}
            onFocus={e => {
              console.log('focus');
              inputRef.current?.focus();
            }}
          >
            {autocomplete ? (
              <ComboboxPrimitive.Root
                inline
                open
                autoComplete='none'
                inputValue={searchValue}
                onInputValueChange={(value: string) => onSearch?.(value)}
                autoHighlight
                highlightItemOnHover
              >
                <ComboboxPrimitive.Input
                  autoFocus
                  placeholder={searchPlaceholder}
                  className={styles.comboboxInput}
                  ref={inputRef}
                  onKeyDown={e => {
                    if (e.key !== 'Escape') {
                      e.stopPropagation();
                    }
                  }}
                  onBlurCapture={e => {
                    console.log('blur');
                    e.stopPropagation();
                    e.preventDefault();
                    // e.preventBaseUIHandler();
                  }}
                />
                <ComboboxPrimitive.List className={styles.comboboxContent}>
                  {children}
                </ComboboxPrimitive.List>
              </ComboboxPrimitive.Root>
            ) : (
              children
            )}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    );
  }
);
MenuContent.displayName = 'Menu.Content';

export const MenuSubContent = forwardRef<HTMLDivElement, MenuContentProps>(
  ({ ...props }, ref) => <MenuContent ref={ref} sideOffset={2} {...props} />
);
MenuSubContent.displayName = 'Menu.SubContent';
