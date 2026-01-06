'use client';

import { ComboboxList } from '@ariakit/react';
import { cx } from 'class-variance-authority';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import styles from './combobox.module.css';
import { useComboboxContext } from './combobox-root';

export interface ComboboxContentProps
  extends Omit<
    ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    'asChild'
  > {
  width?: 'trigger' | 'auto' | number;
}

export const ComboboxContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComboboxContentProps
>(
  (
    {
      className,
      children,
      sideOffset = 4,
      width = 'trigger',
      align = 'start',
      onOpenAutoFocus,
      onInteractOutside,
      ...props
    },
    ref
  ) => {
    const { inputRef, listRef } = useComboboxContext();

    const widthStyle =
      width === 'trigger'
        ? { minWidth: 'var(--radix-popover-trigger-width)' }
        : width === 'auto'
          ? {}
          : { width };

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          align={align}
          className={cx(styles.content, className)}
          style={widthStyle}
          onOpenAutoFocus={event => {
            event.preventDefault();
            onOpenAutoFocus?.(event);
          }}
          onInteractOutside={event => {
            const target = event.target as Element | null;
            const isInput = target === inputRef.current;
            const inListbox = target && listRef.current?.contains(target);
            if (isInput || inListbox) {
              event.preventDefault();
            }
            onInteractOutside?.(event);
          }}
          {...props}
        >
          <ComboboxList ref={listRef} role='listbox' className={styles.list}>
            {children}
          </ComboboxList>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  }
);
ComboboxContent.displayName = 'ComboboxContent';
