'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { type ComponentProps } from 'react';
import { ChevronDownIcon } from '~/icons';
import { Chip } from '../chip';
import { Flex } from '../flex';
import { Input } from '../input';
import styles from './combobox.module.css';
import { ComboboxClear } from './combobox-misc';
import { useComboboxContext } from './combobox-root';

const MAX_CHIPS_VISIBLE = 2;

export interface ComboboxInputProps
  extends Omit<
    ComponentProps<typeof Input>,
    'trailingIcon' | 'suffix' | 'chips' | 'maxChipsVisible'
  > {
  /**
   * Shows a clear button before the chevron.
   * @default false
   */
  showClearButton?: boolean;
}

export const ComboboxInput = ({
  ref,
  disabled,
  showClearButton = false,
  ...props
}: ComboboxInputProps) => {
  const { multiple, inputContainerRef, value, onValueChange, getLabel } =
    useComboboxContext();
  const values = multiple && Array.isArray(value) ? value : [];
  const chevron = <ChevronDownIcon />;

  const input = (
    <ComboboxPrimitive.Input
      ref={ref}
      onKeyDown={event => {
        // Base UI removes the last rendered chip on Backspace. When chips are
        // hidden behind "+N", that is not the last value.
        if (
          event.key !== 'Backspace' ||
          values.length <= MAX_CHIPS_VISIBLE ||
          event.currentTarget.value !== '' ||
          event.currentTarget.readOnly ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey ||
          event.shiftKey ||
          event.baseUIHandlerPrevented
        )
          return;
        event.preventBaseUIHandler();
        onValueChange?.(values.slice(0, -1));
      }}
      render={
        <Input
          containerRef={inputContainerRef}
          trailingIcon={
            showClearButton ? (
              <Flex align='center' gap={2} className={styles.trailing}>
                <ComboboxClear />
                {chevron}
              </Flex>
            ) : (
              chevron
            )
          }
          chips={values.map((val, index) => (
            <Chip
              key={index}
              render={<ComboboxPrimitive.Chip />}
              disabled={disabled}
              data-slot='combobox-chip'
            >
              {getLabel(val)}
              <Chip.Remove
                render={<ComboboxPrimitive.ChipRemove />}
                data-slot='combobox-chip-remove'
              />
            </Chip>
          ))}
          maxChipsVisible={MAX_CHIPS_VISIBLE}
          disabled={disabled}
          data-slot='combobox-input'
          {...props}
        />
      }
    />
  );

  if (!multiple) return input;

  return (
    <ComboboxPrimitive.Chips
      className={styles.chips}
      data-slot='combobox-chips'
    >
      {input}
    </ComboboxPrimitive.Chips>
  );
};
ComboboxInput.displayName = 'Combobox.Input';
