'use client';

import { BaseUIEvent } from '@base-ui/react';
import { CrossCircledIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { ChangeEvent, RefObject, useCallback, useRef, useState } from 'react';
import { IconButton } from '../icon-button';
import { InputField } from '../input-field';
import { InputFieldProps } from '../input-field/input-field';
import styles from './search.module.css';

export interface SearchProps extends Omit<InputFieldProps, 'leadingIcon'> {
  showClearButton?: boolean;
  onClear?: () => void;
  variant?: 'default' | 'borderless';
  inputRef?: RefObject<HTMLInputElement | null>;
}

export function Search({
  className,
  disabled,
  placeholder = 'Search',
  size,
  showClearButton,
  onClear,
  value: controlledValue,
  onChange,
  width = '100%',
  variant = 'default',
  inputRef: externalRef,
  ...props
}: SearchProps) {
  const internalRef = useRef<HTMLInputElement>(null);
  const inputRef = externalRef ?? internalRef;
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState('');
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange: typeof onChange = useCallback(
    (e: BaseUIEvent<ChangeEvent<HTMLInputElement>>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    },
    [isControlled, onChange]
  );

  const handleClear = useCallback(() => {
    if (disabled) return;
    if (!isControlled) {
      setInternalValue('');
    }
    onClear?.();
  }, [disabled, isControlled, onClear]);

  const trailingIconWithClear =
    showClearButton && currentValue ? (
      <div className={styles.clearButtonWrapper}>
        <IconButton
          size={size === 'small' ? 2 : 3}
          onClick={e => {
            e.stopPropagation();
            handleClear();
          }}
          disabled={disabled}
          aria-label='Clear search'
          className={styles.clearButton}
        >
          <CrossCircledIcon />
        </IconButton>
      </div>
    ) : undefined;

  return (
    <div
      className={styles.container}
      role='search'
      style={{ width }}
      onClick={() => inputRef.current?.focus()}
    >
      <InputField
        ref={inputRef}
        leadingIcon={<MagnifyingGlassIcon />}
        trailingIcon={trailingIconWithClear}
        placeholder={placeholder}
        disabled={disabled}
        value={currentValue}
        onChange={handleChange}
        size={size}
        className={className}
        aria-label={placeholder}
        variant={variant}
        {...props}
      />
    </div>
  );
}

Search.displayName = 'Search';
