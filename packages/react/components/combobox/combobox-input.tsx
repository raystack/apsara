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
  const { multiple, inputContainerRef, value, getLabel } = useComboboxContext();
  const chevron = <ChevronDownIcon />;

  const input = (
    <ComboboxPrimitive.Input
      ref={ref}
      disabled={disabled}
      render={
        <Input
          containerRef={inputContainerRef}
          trailingIcon={
            showClearButton ? (
              <Flex align='center' gap={2} className={styles.trailing}>
                <ComboboxClear disabled={disabled} />
                {chevron}
              </Flex>
            ) : (
              chevron
            )
          }
          chips={
            multiple && Array.isArray(value)
              ? value.map((val, index) => (
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
                ))
              : undefined
          }
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
