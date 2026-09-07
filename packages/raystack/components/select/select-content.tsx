'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import {
  type PortalContainer,
  useThemeInjection
} from '../theme-preview/portal';
import { radiusClass } from '../theme-preview/radius';
import type { Radius } from '../theme-preview/settings';
import styles from './select.module.css';
import { useSelectContext } from './select-root';

export interface SelectContentProps
  extends Omit<
      SelectPrimitive.Positioner.Props,
      'render' | 'className' | 'style' | 'ref'
    >,
    SelectPrimitive.Popup.Props {
  searchPlaceholder?: string;
  /**
   * Portals into this element instead of `document.body`. Only the
   * autocomplete variant portals; the plain variant keeps its items in the
   * DOM so the trigger can display the selected value.
   */
  container?: PortalContainer;
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
  container,
  radius,
  ...props
}: SelectContentProps) {
  const { autocomplete, multiple } = useSelectContext();
  const theme = useThemeInjection();

  if (autocomplete) {
    return (
      <ComboboxPrimitive.Portal keepMounted container={container}>
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
              radiusClass(radius),
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
            <ComboboxPrimitive.List
              className={styles.comboboxContent}
              data-slot='select-list'
            >
              {children}
            </ComboboxPrimitive.List>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    );
  }

  return (
    <SelectPrimitive.Positioner
      sideOffset={sideOffset}
      side={side}
      align={align}
      className={styles.positioner}
      alignItemWithTrigger={false}
      data-slot='select-positioner'
    >
      <SelectPrimitive.Popup
        {...theme}
        className={cx(
          styles.content,
          theme?.className,
          radiusClass(radius),
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
  );
}
SelectContent.displayName = 'Select.Content';
