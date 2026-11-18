'use client';

import { Menu as MenuPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { useEffect, useRef } from 'react';
import { type Radius, radiusStyle } from '../../shared/radius';
import { useThemeInjection } from '../theme/portal';
import styles from './menu.module.css';
import { MenuEmptyState } from './menu-misc';
import { useMenuContext } from './menu-root';
import { splitChildren } from './utils';

export interface MenuContentProps
  extends Omit<
      MenuPrimitive.Positioner.Props,
      'render' | 'className' | 'style'
    >,
    MenuPrimitive.Popup.Props {
  searchPlaceholder?: string;
  /** Corner radius for this menu only. Overrides the theme's `radius`. */
  radius?: Radius;
}

export function MenuContent({
  ref,
  className,
  children,
  searchPlaceholder = 'Search...',
  render,
  finalFocus,
  style,
  sideOffset = 4,
  align = 'start',
  onFocus,
  radius,
  ...positionerProps
}: MenuContentProps) {
  const { autocomplete } = useMenuContext();
  const theme = useThemeInjection();

  return (
    <MenuPrimitive.Portal {...theme}>
      <MenuPrimitive.Positioner
        data-slot='menu-positioner'
        className={styles.positioner}
        sideOffset={sideOffset}
        align={align}
        {...positionerProps}
      >
        <MenuPrimitive.Popup
          ref={ref}
          {...theme}
          data-slot='menu-content'
          className={cx(
            styles.content,
            autocomplete && styles.comboboxContainer,
            theme?.className,
            radiusStyle({ radius }),
            className
          )}
          style={style}
          render={render}
          finalFocus={finalFocus}
          onFocus={onFocus}
        >
          {autocomplete ? (
            <MenuSearch slotPrefix='menu' placeholder={searchPlaceholder}>
              {children}
            </MenuSearch>
          ) : (
            children
          )}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}
MenuContent.displayName = 'Menu.Content';

/**
 * Renders the search input, the empty state, and the filtered list.
 * @remarks Only for internal usage.
 */
export function MenuSearch({
  slotPrefix,
  placeholder,
  emptyStateType = MenuEmptyState,
  children
}: {
  slotPrefix: string;
  placeholder: string;
  emptyStateType?: unknown;
  children: React.ReactNode;
}) {
  const [emptyState, items] = splitChildren(children, emptyStateType);
  const { openedByHover, parent } = useMenuContext();
  const isSubmenu = !!parent;
  const inputRef = useRef<HTMLInputElement>(null);

  // Base UI leaves focus outside a menu opened by hover, so typed keys are lost.
  // A submenu keeps Base UI's behavior: focus stays in the parent input.
  useEffect(() => {
    if (openedByHover && !isSubmenu)
      inputRef.current?.focus({ preventScroll: true });
  }, [openedByHover, isSubmenu]);

  return (
    <>
      <MenuPrimitive.Input
        ref={inputRef}
        data-slot={`${slotPrefix}-search-input`}
        placeholder={placeholder}
        aria-label={placeholder}
        className={styles.comboboxInput}
      />
      {emptyState}
      <MenuPrimitive.List
        data-slot={`${slotPrefix}-search-list`}
        className={styles.comboboxContent}
      >
        {items}
      </MenuPrimitive.List>
    </>
  );
}

export function MenuSubContent(props: MenuContentProps) {
  return <MenuContent sideOffset={2} {...props} />;
}
MenuSubContent.displayName = 'Menu.SubmenuContent';
