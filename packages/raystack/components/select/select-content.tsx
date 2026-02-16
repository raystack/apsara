'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';
import styles from './select.module.css';
import { useSelectContext } from './select-root';

export interface SelectContentProps {
  searchPlaceholder?: string;
  sideOffset?: number;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  (
    {
      className,
      children,
      searchPlaceholder = 'Search...',
      sideOffset = 4,
      ...props
    },
    ref
  ) => {
    const { mode, triggerRef } = useSelectContext();

    if (mode === 'combobox') {
      return (
        <ComboboxPrimitive.Portal>
          <ComboboxPrimitive.Positioner
            sideOffset={sideOffset}
            className={styles.positioner}
            anchor={triggerRef}
          >
            <ComboboxPrimitive.Popup
              ref={ref as React.Ref<ElementRef<typeof ComboboxPrimitive.Popup>>}
              className={cx(styles.content, className)}
              {...props}
            >
              <ComboboxPrimitive.Input
                placeholder={searchPlaceholder}
                className={styles.comboboxInput}
              />
              <ComboboxPrimitive.List className={styles.list}>
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
          ref={ref as React.Ref<ElementRef<typeof SelectPrimitive.Popup>>}
          className={cx(styles.content, className)}
          {...props}
        >
          <SelectPrimitive.List className={styles.list}>
            {children}
          </SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    );
  }
);
SelectContent.displayName = 'Select.Content';
