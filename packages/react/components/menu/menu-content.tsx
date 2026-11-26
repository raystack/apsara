'use client';

import { Menu as MenuPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type Radius, radiusStyle } from '../../shared/radius';
import { useThemeInjection } from '../theme/portal';
import styles from './menu.module.css';
import { useMenuContext } from './menu-root';

export interface MenuContentProps
  extends Omit<
      MenuPrimitive.Positioner.Props,
      'render' | 'className' | 'style'
    >,
    MenuPrimitive.Popup.Props {
  /**
   * Placeholder and accessible name of the search input. An empty value uses "Search" as the accessible name.
   * @default "Search..."
   */
  searchPlaceholder?: string;
  /**
   * Distance between the anchor and the popup in pixels.
   * @default 4
   */
  sideOffset?: MenuPrimitive.Positioner.Props['sideOffset'];
  /**
   * How to align the popup relative to the specified side.
   * @default "start"
   */
  align?: MenuPrimitive.Positioner.Props['align'];
  /** Corner radius for this menu only. Defaults to the theme's `radius`. */
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
  const { autocomplete, autocompleteMode } = useMenuContext();
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
            autocomplete &&
              autocompleteMode === 'auto' &&
              styles['autocomplete-mode-auto'],
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
 * Renders the search input and the filtered list.
 * @remarks Only for internal usage.
 */
export function MenuSearch({
  slotPrefix,
  placeholder,
  children
}: {
  slotPrefix: string;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <MenuPrimitive.Input
        data-slot={`${slotPrefix}-search-input`}
        placeholder={placeholder}
        aria-label={placeholder || 'Search'}
        className={styles.comboboxInput}
      />
      <MenuPrimitive.List
        data-slot={`${slotPrefix}-search-list`}
        className={styles.comboboxContent}
      >
        {children}
      </MenuPrimitive.List>
    </>
  );
}

interface MenuSubContentProps extends MenuContentProps {
  /**
   * Which side of the anchor element to align the submenu against.
   * @default "inline-end"
   */
  side?: MenuPrimitive.Positioner.Props['side'];
  /**
   * Distance between the anchor and the submenu in pixels.
   * @default 2
   */
  sideOffset?: MenuPrimitive.Positioner.Props['sideOffset'];
}

export function MenuSubContent(props: MenuSubContentProps) {
  return <MenuContent sideOffset={2} {...props} />;
}
MenuSubContent.displayName = 'Menu.SubmenuContent';
