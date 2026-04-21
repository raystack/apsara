'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { type ComponentProps, type ReactNode } from 'react';
import { InputField } from '../input-field';
import styles from './command.module.css';
import { useCommandContext } from './command-root';

export interface CommandInputProps
  extends Omit<
    ComponentProps<typeof InputField>,
    'trailingIcon' | 'chips' | 'maxChipsVisible' | 'variant'
  > {
  /** Icon rendered at the start of the input. Defaults to a magnifying glass. */
  leadingIcon?: ReactNode;
}

export const CommandInput = ({
  ref,
  leadingIcon,
  autoFocus = true,
  size = 'large',
  placeholder = 'Search...',
  ...props
}: CommandInputProps) => {
  const { inputContainerRef } = useCommandContext();
  return (
    <div className={styles.inputWrapper}>
      <AutocompletePrimitive.Input
        ref={ref}
        render={
          <InputField
            containerRef={inputContainerRef}
            leadingIcon={
              leadingIcon ?? (
                <MagnifyingGlassIcon
                  className={styles.inputIcon}
                  width={16}
                  height={16}
                />
              )
            }
            variant='borderless'
            size={size}
            autoFocus={autoFocus}
            placeholder={placeholder}
            {...props}
          />
        }
      />
    </div>
  );
};

CommandInput.displayName = 'Command.Input';
