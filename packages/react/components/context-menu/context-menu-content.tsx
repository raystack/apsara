'use client';

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type Radius, radiusStyle } from '../../shared/radius';
import styles from '../menu/menu.module.css';
import { MenuSearch } from '../menu/menu-content';
import { useMenuContext } from '../menu/menu-root';
import { useThemeInjection } from '../theme/portal';
import { ContextMenuEmptyState } from './context-menu-misc';

export interface ContextMenuContentProps
  extends Omit<
      ContextMenuPrimitive.Positioner.Props,
      'render' | 'className' | 'style'
    >,
    ContextMenuPrimitive.Popup.Props {
  searchPlaceholder?: string;
  /** Corner radius for this menu only. Overrides the theme's `radius`. */
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
  const { autocomplete } = useMenuContext();
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
              emptyStateType={ContextMenuEmptyState}
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

export const ContextMenuSubContent = ({
  ...props
}: ContextMenuContentProps) => <ContextMenuContent sideOffset={2} {...props} />;
ContextMenuSubContent.displayName = 'ContextMenu.SubContent';
