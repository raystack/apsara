'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import { cx } from 'class-variance-authority';
import { type ReactNode } from 'react';
import { useItemCount } from '~/shared/item-count';
import styles from './command.module.css';
import { useCommandContext } from './command-root';

/** The number of items that match the search. */
const useMatchCount = () => {
  const { hasItems } = useCommandContext();
  const filteredItems = AutocompletePrimitive.useFilteredItems<unknown>();
  const renderedCount = useItemCount() ?? 0;

  if (!hasItems) return renderedCount;
  return filteredItems.reduce<number>(
    (count, item) => count + (isGroup(item) ? item.items.length : 1),
    0
  );
};

const isGroup = (item: unknown): item is { items: readonly unknown[] } =>
  typeof item === 'object' &&
  item !== null &&
  Array.isArray((item as { items?: unknown }).items);

export type CommandEmptyProps = AutocompletePrimitive.Empty.Props;

export const CommandEmpty = ({
  className,
  children,
  ...props
}: CommandEmptyProps) => {
  const count = useMatchCount();

  return (
    <AutocompletePrimitive.Empty
      data-slot='command-empty'
      className={cx(styles.empty, className)}
      {...props}
    >
      {count ? null : children}
    </AutocompletePrimitive.Empty>
  );
};

CommandEmpty.displayName = 'Command.Empty';

export interface CommandStatusProps
  extends Omit<AutocompletePrimitive.Status.Props, 'children'> {
  /**
   * Text to announce. A function receives the number of matching items.
   * @default count => `${count} results`
   */
  children?: ReactNode | ((count: number) => ReactNode);
}

const defaultStatus = (count: number) =>
  `${count} ${count === 1 ? 'result' : 'results'}`;

export const CommandStatus = ({
  className,
  children = defaultStatus,
  ...props
}: CommandStatusProps) => {
  const { inputValue } = useCommandContext();
  const count = useMatchCount();

  let content: ReactNode = null;
  if (inputValue) {
    content = typeof children === 'function' ? children(count) : children;
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
