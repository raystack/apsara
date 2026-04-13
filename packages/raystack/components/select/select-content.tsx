'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './select.module.css';
import { useSelectContext } from './select-root';

export interface SelectContentProps
  extends Omit<
      SelectPrimitive.Positioner.Props,
      'render' | 'className' | 'style' | 'ref'
    >,
    SelectPrimitive.Popup.Props {
  searchPlaceholder?: string;
}

export function SelectContent({
  className,
  children,
  searchPlaceholder = 'Search...',
  sideOffset = 4,
  ...props
}: SelectContentProps) {
  const { autocomplete, multiple } = useSelectContext();

  if (autocomplete) {
    return (
      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner
          sideOffset={sideOffset}
          className={styles.positioner}
        >
          <ComboboxPrimitive.Popup
            className={cx(styles.content, className)}
            data-multiselectable={multiple ? true : undefined}
            {...props}
          >
            <ComboboxPrimitive.Input
              placeholder={searchPlaceholder}
              className={styles.comboboxInput}
            />
            <ComboboxPrimitive.List
              className={styles.comboboxContent}
              aria-multiselectable={multiple ? true : undefined}
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
      className={styles.positioner}
      alignItemWithTrigger={false}
    >
      <SelectPrimitive.Popup
        className={cx(styles.content, className)}
        data-multiselectable={multiple ? true : undefined}
        {...props}
      >
        <SelectPrimitive.List className={styles.viewport}>
          {children}
        </SelectPrimitive.List>
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  );
}
SelectContent.displayName = 'Select.Content';
