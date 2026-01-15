'use client';

import { Combobox } from '@ariakit/react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Popover as PopoverPrimitive } from 'radix-ui';
import {
  ElementRef,
  FocusEvent,
  forwardRef,
  KeyboardEvent,
  useCallback
} from 'react';
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
  ElementRef<typeof Combobox>,
  ComboboxInputProps
>(({ onBlur, ...props }, ref) => {
  const {
    inputRef,
    listRef,
    value,
    multiple,
    inputValue,
    setInputValue,
    setValue
  } = useComboboxContext();

  const handleOnKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace') {
        if (multiple && !inputValue?.length) {
          event.preventDefault();
          setValue((value as string[])?.slice(0, -1));
        }
      }
    },
    [multiple, inputValue, value, setValue]
  );
  const handleOnBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      const target = event.relatedTarget as Element | null;
      const isInput = target === inputRef.current;
      const inListbox = target && listRef.current?.contains(target);
      if (isInput || inListbox) return;
      if (!multiple) {
        if (typeof value === 'string' && value.length) setInputValue(value);
        else setInputValue('');
      }
      onBlur?.(event);
    },
    [onBlur, multiple, value, inputRef, listRef, setInputValue]
  );

  return (
    <PopoverPrimitive.Anchor asChild>
      <div>
        <Combobox
          autoSelect='always'
          ref={inputRef}
          render={
            <InputField
              chips={
                multiple && Array.isArray(value)
                  ? value.map(val => ({
                      label: val,
                      onRemove: () =>
                        setValue((value as string[])?.filter(v => v !== val))
                    }))
                  : undefined
              }
              trailingIcon={<ChevronDownIcon className={styles.triggerIcon} />}
              {...props}
            />
          }
          onBlur={handleOnBlur}
          onKeyDown={handleOnKeyDown}
        />
      </div>
    </PopoverPrimitive.Anchor>
  );
});
ComboboxInput.displayName = 'ComboboxInput';
