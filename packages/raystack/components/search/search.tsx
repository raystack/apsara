'use client';

import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { KeyboardEvent, MouseEvent, useRef } from 'react';
import { ClearIcon, SearchIcon } from '~/icons';
import { IconButton } from '../icon-button';
import { Input } from '../input';
import { InputProps } from '../input/input';

import styles from './search.module.css';

export interface SearchProps extends InputProps {
  showClearButton?: boolean;
  onClear?: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>
  ) => void;
  variant?: 'default' | 'borderless';
  /**
   * Clears the input when Escape is pressed and the input has a value.
   * @default true
   */
  clearOnEscape?: boolean;
  /**
   * Removes focus from the input when Escape is pressed.
   * @default true
   */
  blurOnEscape?: boolean;
}

// Uses the native setter and an `input` event so React's onChange and
// Base UI's onValueChange fire as if the user cleared the field.
function clearInputValue(input: HTMLInputElement) {
  const setValue = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value'
  )?.set;
  setValue?.call(input, '');
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

export function Search({
  disabled,
  placeholder = 'Search',
  size,
  showClearButton,
  onClear,
  onKeyDown,
  value,
  width = '100%',
  variant = 'default',
  type = 'search',
  ref,
  leadingIcon = <SearchIcon />,
  clearOnEscape = true,
  blurOnEscape = true,
  ...props
}: SearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(inputRef, ref);

  const handleClear = (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    const input = inputRef.current;
    if (!input || disabled || input.readOnly) return;
    clearInputValue(input);
    onClear?.(event);
  };

  const handleKeyDown: InputProps['onKeyDown'] = event => {
    const input = event.currentTarget;
    if (event.key === 'Escape' && !event.nativeEvent.isComposing) {
      if (clearOnEscape && !input.disabled && !input.readOnly && input.value) {
        // Stop only when there is a value to clear, so an empty field lets
        // Escape reach an enclosing Dialog, Popover or Menu.
        event.preventDefault();
        event.stopPropagation();
        handleClear(event);
      }
      if (blurOnEscape) input.blur();
    }
    onKeyDown?.(event);
  };

  const trailingIconWithClear = showClearButton ? (
    <div className={styles.clearButtonWrapper} data-slot='search-clear'>
      <IconButton
        size={size === 'small' ? 2 : 3}
        onClick={e => {
          e.stopPropagation();
          handleClear(e);
          // The button hides once the input is empty, so focus would
          // otherwise fall back to <body>.
          inputRef.current?.focus();
        }}
        disabled={disabled}
        aria-label='Clear search'
        className={styles.clearButton}
        data-slot='search-clear-button'
      >
        <ClearIcon />
      </IconButton>
    </div>
  ) : undefined;

  return (
    <div
      className={styles.container}
      role='search'
      style={{ width }}
      data-slot='search'
    >
      <Input
        data-slot='search-input'
        leadingIcon={leadingIcon}
        trailingIcon={trailingIconWithClear}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        size={size}
        aria-label={placeholder}
        variant={variant}
        type={type}
        ref={mergedRef}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </div>
  );
}

Search.displayName = 'Search';
