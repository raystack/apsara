'use client';

import { CrossCircledIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { IconButton } from '../icon-button';
import { Input } from '../input';
import { InputProps } from '../input/input';

import styles from './search.module.css';

export interface SearchProps extends Omit<InputProps, 'leadingIcon'> {
  showClearButton?: boolean;
  onClear?: () => void;
  variant?: 'default' | 'borderless';
}

export function Search({
  disabled,
  placeholder = 'Search',
  size,
  showClearButton,
  onClear,
  value,
  width = '100%',
  variant = 'default',
  ...props
}: SearchProps) {
  const trailingIconWithClear = showClearButton ? (
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
      <Input
        leadingIcon={<MagnifyingGlassIcon />}
        trailingIcon={trailingIconWithClear}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        size={size}
        aria-label={placeholder}
        variant={variant}
        {...props}
      />
    </div>
  );
}

Search.displayName = 'Search';
