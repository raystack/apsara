'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import { type ComponentProps, type ReactNode } from 'react';
import { Input } from '../input';
import styles from './command.module.css';
import { useCommandContext } from './command-root';

export interface CommandInputProps
  extends Omit<
    ComponentProps<typeof Input>,
    'trailingIcon' | 'chips' | 'maxChipsVisible' | 'variant'
  > {
  /** Icon rendered at the start of the input. */
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
          <Input
            containerRef={inputContainerRef}
            leadingIcon={leadingIcon}
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
