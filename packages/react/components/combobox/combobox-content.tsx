'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { Children, isValidElement, type ReactNode } from 'react';
import { type Radius, radiusStyle } from '../../shared/radius';
import { useThemeInjection } from '../theme/portal';
import styles from './combobox.module.css';
import { ComboboxEmpty } from './combobox-misc';
import { useComboboxContext } from './combobox-root';

export interface ComboboxContentProps<Item = unknown>
  extends Omit<
      ComboboxPrimitive.Positioner.Props,
      'render' | 'className' | 'style' | 'children'
    >,
    Omit<ComboboxPrimitive.Popup.Props, 'children'> {
  /** Corner radius for this popup only. Overrides the theme's `radius`. */
  radius?: Radius;
  /**
   * The list content. Pass a function to render each item that matches the input when `items` is set on the root.
   */
  children?: ReactNode | ((item: Item, index: number) => ReactNode);
}

export const ComboboxContent = <Item,>({
  ref,
  className,
  children,
  style,
  render,
  initialFocus,
  finalFocus,
  sideOffset = 4,
  radius,
  ...positionerProps
}: ComboboxContentProps<Item>) => {
  const { inputContainerRef } = useComboboxContext();
  const theme = useThemeInjection();

  // Empty is a live region, and a listbox only allows options and groups, so
  // it is taken out of the children and rendered before the list.
  let empty: ReactNode = <ComboboxEmpty>No results</ComboboxEmpty>;
  let listChildren = children;
  if (typeof children !== 'function') {
    listChildren = Children.toArray(children).filter(child => {
      if (!isValidElement(child) || child.type !== ComboboxEmpty) return true;
      empty = child;
      return false;
    });
  }
  return (
    <ComboboxPrimitive.Portal {...theme}>
      <ComboboxPrimitive.Positioner
        sideOffset={sideOffset}
        className={styles.positioner}
        anchor={inputContainerRef}
        data-slot='combobox-positioner'
        {...positionerProps}
      >
        <ComboboxPrimitive.Popup
          ref={ref}
          {...theme}
          className={cx(
            styles.content,
            theme?.className,
            radiusStyle({ radius }),
            className
          )}
          style={style}
          render={render}
          initialFocus={initialFocus}
          finalFocus={finalFocus}
          data-slot='combobox-content'
        >
          {empty}
          <ComboboxPrimitive.List
            className={styles.list}
            data-slot='combobox-list'
          >
            {listChildren}
          </ComboboxPrimitive.List>
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
};
ComboboxContent.displayName = 'Combobox.Content';
