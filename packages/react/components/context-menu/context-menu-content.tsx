'use client';

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type Radius, radiusStyle } from '../../shared/radius';
import styles from '../menu/menu.module.css';
import { MenuSearch } from '../menu/menu-content';
import { useMenuContext } from '../menu/menu-root';
import { useThemeInjection } from '../theme/portal';

export interface ContextMenuContentProps
  extends Omit<
      ContextMenuPrimitive.Positioner.Props,
      'render' | 'className' | 'style'
    >,
    ContextMenuPrimitive.Popup.Props {
  /**
   * Placeholder and accessible name of the search input. An empty value uses "Search" as the accessible name.
   * @default "Search..."
   */
  searchPlaceholder?: string;
  /**
   * Distance between the anchor and the popup in pixels.
   * @default 4
   */
  sideOffset?: ContextMenuPrimitive.Positioner.Props['sideOffset'];
  /** Corner radius for this menu only. Defaults to the theme's `radius`. */
  radius?: Radius;
}

export const ContextMenuContent = ({
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
}: ContextMenuContentProps) => {
  const { autocomplete, autocompleteMode } = useMenuContext();
  const theme = useThemeInjection();

  return (
    <ContextMenuPrimitive.Portal {...theme}>
      <ContextMenuPrimitive.Positioner
        data-slot='context-menu-positioner'
        className={cx(styles.positioner)}
        sideOffset={sideOffset}
        align={align}
        {...positionerProps}
      >
        <ContextMenuPrimitive.Popup
          ref={ref}
          {...theme}
          data-slot='context-menu-content'
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
            <MenuSearch
              slotPrefix='context-menu'
              placeholder={searchPlaceholder}
            >
              {children}
            </MenuSearch>
          ) : (
            children
          )}
        </ContextMenuPrimitive.Popup>
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
};
ContextMenuContent.displayName = 'ContextMenu.Content';

interface ContextMenuSubContentProps extends ContextMenuContentProps {
  /**
   * Which side of the anchor element to align the submenu against.
   * @default "inline-end"
   */
  side?: ContextMenuPrimitive.Positioner.Props['side'];
  /**
   * Distance between the anchor and the submenu in pixels.
   * @default 2
   */
  sideOffset?: ContextMenuPrimitive.Positioner.Props['sideOffset'];
}

export const ContextMenuSubContent = ({
  ...props
}: ContextMenuSubContentProps) => (
  <ContextMenuContent sideOffset={2} {...props} />
);
ContextMenuSubContent.displayName = 'ContextMenu.SubContent';
