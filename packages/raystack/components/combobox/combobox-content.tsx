'use client';

import { ComboboxList } from '@ariakit/react';
import { cx } from 'class-variance-authority';
import { Popover as PopoverPrimitive } from 'radix-ui';
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useCallback
} from 'react';
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
      onFocusOutside,
      ...props
    },
    ref
  ) => {
    const { inputRef, listRef, value, setInputValue, multiple } =
      useComboboxContext();

    const handleOnInteractOutside = useCallback<
      NonNullable<
        ComponentPropsWithoutRef<
          typeof PopoverPrimitive.Content
        >['onInteractOutside']
      >
    >(
      event => {
        const target = event.target as Element | null;
        const isInput = target === inputRef.current;
        const inListbox = target && listRef.current?.contains(target);
        if (isInput || inListbox) {
          event.preventDefault();
          return;
        }
        if (!multiple) {
          if (typeof value === 'string' && value.length) setInputValue(value);
          else setInputValue('');
        }
        onInteractOutside?.(event);
      },
      [onInteractOutside, inputRef, listRef, multiple, value, setInputValue]
    );

    const handleOnOpenAutoFocus = useCallback<
      NonNullable<
        ComponentPropsWithoutRef<
          typeof PopoverPrimitive.Content
        >['onOpenAutoFocus']
      >
    >(
      event => {
        event.preventDefault();
        onOpenAutoFocus?.(event);
      },
      [onOpenAutoFocus]
    );
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          align={align}
          className={cx(styles.content, className)}
          onOpenAutoFocus={handleOnOpenAutoFocus}
          onInteractOutside={handleOnInteractOutside}
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
