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
  /** Node rendered at the end of the item (e.g. `Command.Shortcut`). */
  trailingIcon?: ReactNode;
}

export const CommandItem = ({
  className,
  children,
  value: providedValue,
  leadingIcon,
  trailingIcon,
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

  return (
    <AutocompletePrimitive.Item
      value={value}
      className={cx(styles.item, className)}
      {...props}
    >
      {leadingIcon && <span className={styles.itemIcon}>{leadingIcon}</span>}
      <span className={styles.itemLabel}>{children}</span>
      {trailingIcon && (
        <span className={styles.itemTrailing}>{trailingIcon}</span>
      )}
    </AutocompletePrimitive.Item>
  );
};

CommandItem.displayName = 'Command.Item';
