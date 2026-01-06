'use client';

import { Combobox } from '@ariakit/react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cva, VariantProps } from 'class-variance-authority';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import { Flex } from '../flex';
import styles from './combobox.module.css';
import { useComboboxContext } from './combobox-root';

const input = cva(styles.input, {
  variants: {
    size: {
      small: styles['input-small'],
      medium: styles['input-medium']
    },
    variant: {
      outline: styles['input-outline'],
      text: styles['input-text']
    }
  },
  defaultVariants: {
    size: 'medium',
    variant: 'outline'
  }
});

export interface ComboboxInputProps
  extends Omit<ComponentPropsWithoutRef<typeof Combobox>, 'size'>,
    VariantProps<typeof input> {
  showIcon?: boolean;
}

export const ComboboxInput = forwardRef<
  ElementRef<typeof Combobox>,
  ComboboxInputProps
>(
  (
    {
      size,
      variant,
      className,
      placeholder = 'Search...',
      showIcon = true,
      ...props
    },
    ref
  ) => {
    const { inputRef, listRef, setOpen } = useComboboxContext();

    return (
      <PopoverPrimitive.Anchor asChild>
        <Flex className={input({ size, variant, className })} align='center'>
          <Combobox
            ref={node => {
              // Handle both refs
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              (
                inputRef as React.MutableRefObject<HTMLInputElement | null>
              ).current = node;
            }}
            placeholder={placeholder}
            className={styles.inputField}
            onFocus={() => setOpen(true)}
            onBlurCapture={event => {
              const target = event.relatedTarget as Element | null;
              const isInput = target === inputRef.current;
              const inListbox = target && listRef.current?.contains(target);
              if (isInput || inListbox) {
                event.preventDefault();
              }
            }}
            {...props}
          />
          {showIcon && (
            <ChevronDownIcon className={styles.inputIcon} aria-hidden='true' />
          )}
        </Flex>
      </PopoverPrimitive.Anchor>
    );
  }
);
ComboboxInput.displayName = 'ComboboxInput';
