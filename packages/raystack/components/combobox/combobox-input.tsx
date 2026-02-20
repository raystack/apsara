'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { ElementRef, forwardRef } from 'react';
import { InputField } from '../input-field';
import { InputFieldProps } from '../input-field/input-field';
import styles from './combobox.module.css';
import { useComboboxContext } from './combobox-root';

export interface ComboboxInputProps
  extends Omit<
    InputFieldProps,
    'trailingIcon' | 'suffix' | 'chips' | 'maxChipsVisible'
  > {}

export const ComboboxInput = forwardRef<
  ElementRef<typeof ComboboxPrimitive.Input>,
  ComboboxInputProps
>(({ ...props }, ref) => {
  const { multiple, inputContainerRef, value, onValueChange } =
    useComboboxContext();
  return (
    <ComboboxPrimitive.Input
      ref={ref}
      render={
        <InputField
          containerRef={inputContainerRef}
          chips={
            multiple && Array.isArray(value)
              ? value.map(val => ({
                  label: val,
                  onRemove: () =>
                    onValueChange?.((value as string[])?.filter(v => v !== val))
                }))
              : undefined
          }
          trailingIcon={<ChevronDownIcon className={styles.triggerIcon} />}
          {...props}
        />
      }
    />
  );
});
ComboboxInput.displayName = 'Combobox.Input';
