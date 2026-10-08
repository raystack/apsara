'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { Children, isValidElement, ReactNode } from 'react';
import { type Radius, radiusStyle } from '../../shared/radius';
import { useThemeInjection } from '../theme/portal';
import styles from './select.module.css';
import { SelectEmpty, SelectStatus } from './select-misc';
import { useSelectContext } from './select-root';

// Base UI expects Empty and Status as siblings of the list, not inside the listbox.
const splitLiveRegions = (children: ReactNode) => {
  const regions: ReactNode[] = [];
  const items: ReactNode[] = [];
  Children.forEach(children, child => {
    const isRegion =
      isValidElement(child) &&
      (child.type === SelectEmpty || child.type === SelectStatus);
    (isRegion ? regions : items).push(child);
  });
  return { regions, items };
};

export interface SelectContentProps
  extends Omit<
      SelectPrimitive.Positioner.Props,
      'render' | 'className' | 'style' | 'ref'
    >,
    SelectPrimitive.Popup.Props {
  searchPlaceholder?: string;
  /** Corner radius for this popup only. Overrides the theme's `radius`. */
  radius?: Radius;
}

export function SelectContent({
  className,
  children,
  searchPlaceholder = 'Search...',
  sideOffset = 4,
  side = 'bottom',
  align = 'start',
  alignItemWithTrigger = false,
  radius,
  ...props
}: SelectContentProps) {
  const { autocomplete, multiple } = useSelectContext();
  const theme = useThemeInjection();

  if (autocomplete) {
    const { regions, items } = splitLiveRegions(children);
    return (
      <ComboboxPrimitive.Portal keepMounted {...theme}>
        <ComboboxPrimitive.Positioner
          sideOffset={sideOffset}
          side={side}
          align={align}
          className={styles.positioner}
          data-slot='select-positioner'
        >
          <ComboboxPrimitive.Popup
            {...theme}
            className={cx(
              styles.content,
              theme?.className,
              radiusStyle({ radius }),
              className
            )}
            data-multiselectable={multiple ? true : undefined}
            data-slot='select-content'
            {...props}
          >
            <ComboboxPrimitive.Input
              placeholder={searchPlaceholder}
              className={styles.comboboxInput}
              size={12}
              data-slot='select-search'
            />
            {regions}
            <ComboboxPrimitive.List
              className={styles.comboboxContent}
              data-slot='select-list'
            >
              {items}
            </ComboboxPrimitive.List>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    );
  }

  return (
    <SelectPrimitive.Portal {...theme}>
      <SelectPrimitive.Positioner
        sideOffset={sideOffset}
        side={side}
        align={align}
        className={styles.positioner}
        alignItemWithTrigger={alignItemWithTrigger}
        data-slot='select-positioner'
      >
        <SelectPrimitive.Popup
          {...theme}
          className={cx(
            styles.content,
            theme?.className,
            radiusStyle({ radius }),
            className
          )}
          data-multiselectable={multiple ? true : undefined}
          data-slot='select-content'
          {...props}
        >
          <SelectPrimitive.List
            className={styles.viewport}
            data-slot='select-list'
          >
            {children}
          </SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}
SelectContent.displayName = 'Select.Content';
