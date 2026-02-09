'use client';

import {
  Autocomplete as AutocompletePrimitive,
  Menu as MenuPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { forwardRef } from 'react';
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
    const { autocomplete } = useMenuContext();

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
          >
            {autocomplete ? (
              <>
                <AutocompletePrimitive.Input
                  autoFocus
                  placeholder={searchPlaceholder}
                  className={styles.comboboxInput}
                  onKeyDown={e => {
                    e.stopPropagation();
                  }}
                  tabIndex={-1}
                />
                <AutocompletePrimitive.List className={styles.comboboxContent}>
                  {children}
                </AutocompletePrimitive.List>
              </>
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
