'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import { cx } from 'class-variance-authority';
import { type ReactNode } from 'react';
import styles from './command.module.css';
import { useCommandContext } from './command-root';

export type CommandEmptyProps = AutocompletePrimitive.Empty.Props;

export const CommandEmpty = ({ className, ...props }: CommandEmptyProps) => {
  return (
    <AutocompletePrimitive.Empty
      data-slot='command-empty'
      className={cx(styles.empty, className)}
      {...props}
    />
  );
};

CommandEmpty.displayName = 'Command.Empty';

const isGroup = (item: unknown): item is { items: readonly unknown[] } =>
  typeof item === 'object' &&
  item !== null &&
  Array.isArray((item as { items?: unknown }).items);

const countItems = (items: readonly unknown[]) =>
  items.reduce<number>(
    (count, item) => count + (isGroup(item) ? item.items.length : 1),
    0
  );

export interface CommandStatusProps
  extends Omit<AutocompletePrimitive.Status.Props, 'children'> {
  /** Text to announce while the input has text. A function receives the number of matching items and needs the `items` prop. */
  children?: ReactNode | ((count: number) => ReactNode);
}

export const CommandStatus = ({
  className,
  children,
  ...props
}: CommandStatusProps) => {
  const { inputValue, hasItems } = useCommandContext();
  const filteredItems = AutocompletePrimitive.useFilteredItems<unknown>();

  let content: ReactNode = null;
  if (inputValue) {
    if (typeof children !== 'function') content = children;
    else if (hasItems) content = children(countItems(filteredItems));
  }

  return (
    <AutocompletePrimitive.Status
      data-slot='command-status'
      className={cx(styles.status, className)}
      {...props}
    >
      {content}
    </AutocompletePrimitive.Status>
  );
};

CommandStatus.displayName = 'Command.Status';
