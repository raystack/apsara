'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { type ComponentProps } from 'react';
import { Input } from '../input';
import styles from './combobox.module.css';
import { useComboboxContext } from './combobox-root';

export interface ComboboxInputProps
  extends Omit<
    ComponentProps<typeof Input>,
    'trailingIcon' | 'suffix' | 'chips' | 'maxChipsVisible'
  > {}

export const ComboboxInput = ({
  ref,
  placeholder,
  ...props
}: ComboboxInputProps) => {
  const { multiple, inputContainerRef, value, onValueChange } =
    useComboboxContext();
  const hasSelectedChips = multiple && Array.isArray(value) && value.length > 0;
  return (
    <ComboboxPrimitive.Input
      ref={ref}
      render={
        <Input
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
          placeholder={hasSelectedChips ? undefined : placeholder}
          trailingIcon={<ChevronDownIcon className={styles.triggerIcon} />}
          {...props}
        />
      }
    />
  );
};
ComboboxInput.displayName = 'Combobox.Input';
