'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import { cx } from 'class-variance-authority';
import { type ReactNode } from 'react';
import { getMatch } from '../menu/utils';
import styles from './command.module.css';
import { useCommandContext } from './command-root';

export interface CommandItemProps extends AutocompletePrimitive.Item.Props {
  /** Icon rendered at the start of the item. */
  leadingIcon?: ReactNode;
  /** Icon rendered at the end of the item (e.g. `Command.Shortcut`). */
  trailingIcon?: ReactNode;
}

export const CommandItem = ({
  className,
  children,
  value: providedValue,
  leadingIcon,
  trailingIcon,
  disabled,
  ...props
}: CommandItemProps) => {
  const value =
    providedValue !== undefined
      ? providedValue
      : typeof children === 'string'
        ? children
        : undefined;

  const { inputValue, hasItems } = useCommandContext();

  if (!hasItems && inputValue?.length) {
    const isMatched = getMatch(
      typeof value === 'string' ? value : undefined,
      children,
      inputValue
    );
    if (!isMatched) return null;
  }

  const content = (
    <>
      {leadingIcon && (
        <span data-slot='command-item-leading-icon' className={styles.itemIcon}>
          {leadingIcon}
        </span>
      )}
      <span data-slot='command-item-label' className={styles.itemLabel}>
        {children}
      </span>
      {trailingIcon && (
        <span
          data-slot='command-item-trailing-icon'
          className={styles.itemTrailing}
        >
          {trailingIcon}
        </span>
      )}
    </>
  );

  /**
   * TODO: Fix this when Base UI fixes this issue
   * This is a workaround to prevent item focus when the disabled prop is true.
   */
  if (disabled) {
    return (
      <div
        data-slot='command-item'
        className={cx(styles.item, className)}
        role='option'
        data-disabled={true}
        aria-disabled={true}
      >
        {content}
      </div>
    );
  }

  return (
    <AutocompletePrimitive.Item
      data-slot='command-item'
      value={value}
      className={cx(styles.item, className)}
      {...props}
    >
      {content}
    </AutocompletePrimitive.Item>
  );
};

CommandItem.displayName = 'Command.Item';
