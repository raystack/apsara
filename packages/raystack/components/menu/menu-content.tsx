'use client';

import {
  Autocomplete as AutocompletePrimitive,
  Menu as MenuPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { forwardRef, useCallback, useRef } from 'react';
import styles from './menu.module.css';
import { useMenuContext } from './menu-root';

export interface MenuContentProps extends MenuPrimitive.Popup.Props {
  searchPlaceholder?: string;
  sideOffset?: number;
  side?: MenuPrimitive.Positioner.Props['side'];
  align?: MenuPrimitive.Positioner.Props['align'];
  name?: string;
}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  (
    {
      name,
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
    const focusInput = useCallback(() => {
      if (document?.activeElement !== inputRef.current)
        inputRef.current?.focus();
    }, []);

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
            onFocus={
              autocomplete
                ? e => {
                    console.log('focus ', name);
                    focusInput();
                    e.stopPropagation();
                  }
                : undefined
            }
            // onMouseEnter={e => {
            //   console.log('mouse enter');
            //   inputRef.current?.focus();
            //   e.stopPropagation();
            // }}
            data-menu
          >
            {autocomplete ? (
              <AutocompletePrimitive.Root
                inline
                open
                value={searchValue}
                onValueChange={(value: string) => onSearch?.(value)}
                autoHighlight={searchValue?.length}
                mode='none'
                loopFocus={false}
              >
                <AutocompletePrimitive.Input
                  autoFocus
                  placeholder={searchPlaceholder}
                  className={styles.comboboxInput}
                  ref={inputRef}
                  onKeyDown={e => {
                    if (
                      e.key === 'Escape' ||
                      e.key === 'ArrowLeft' ||
                      e.key === 'ArrowRight'
                    )
                      return;
                    console.log('key down', e.key);
                    e.stopPropagation();
                  }}
                />
                <AutocompletePrimitive.List className={styles.comboboxContent}>
                  {children}
                </AutocompletePrimitive.List>
              </AutocompletePrimitive.Root>
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
