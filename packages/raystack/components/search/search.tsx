'use client';

import { CrossCircledIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { IconButton } from '../icon-button';
import { InputField } from '../input-field';
import { InputFieldProps } from '../input-field/input-field';

import { forwardRef } from 'react';
import styles from './search.module.css';

export interface SearchProps extends Omit<InputFieldProps, 'leadingIcon'> {
  showClearButton?: boolean;
  onClear?: () => void;
  variant?: 'default' | 'borderless';
}

export const Search = forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      className,
      disabled,
      placeholder = 'Search',
      size,
      showClearButton,
      onClear,
      value,
      onChange,
      width = '100%',
      variant = 'default',
      ...props
    }: SearchProps,
    ref
  ) => {
    const trailingIconWithClear =
      showClearButton && value ? (
        <div className={styles.clearButtonWrapper}>
          <IconButton
            size={size === 'small' ? 2 : 3}
            onClick={e => {
              e.stopPropagation();
              if (!disabled && onClear) {
                onClear();
              }
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
      <div className={styles.container} role='search' style={{ width }}>
        <InputField
          leadingIcon={<MagnifyingGlassIcon />}
          trailingIcon={trailingIconWithClear}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          size={size}
          className={className}
          aria-label={placeholder}
          variant={variant}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Search.displayName = 'Search';
