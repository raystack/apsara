'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { type ComponentProps } from 'react';
import { Input } from '../input';
import { useComboboxContext } from './combobox-root';

export interface ComboboxInputProps
  extends Omit<
    ComponentProps<typeof Input>,
    'trailingIcon' | 'suffix' | 'chips' | 'maxChipsVisible'
  > {}

export const ComboboxInput = ({ ref, ...props }: ComboboxInputProps) => {
  const { multiple, inputContainerRef, value, onValueChange } =
    useComboboxContext();
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
          trailingIcon={<ChevronDownIcon />}
          {...props}
        />
      }
    />
  );
};
ComboboxInput.displayName = 'Combobox.Input';
