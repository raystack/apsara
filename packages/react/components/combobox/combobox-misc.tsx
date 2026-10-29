'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { ClearIcon } from '~/icons';
import { IconButton } from '../icon-button';
import type { IconButtonProps } from '../icon-button/icon-button';
import { Label, type LabelProps } from '../label';
import styles from './combobox.module.css';
import { useComboboxContext } from './combobox-root';

export type ComboboxLabelProps = Omit<LabelProps, 'htmlFor'>;

export const ComboboxLabel = (props: ComboboxLabelProps) => {
  const { inputId } = useComboboxContext();
  return <Label htmlFor={inputId} data-slot='combobox-label' {...props} />;
};
ComboboxLabel.displayName = 'Combobox.Label';

export const ComboboxGroupLabel = ({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) => {
  const { inputValue, hasItems } = useComboboxContext();
  if (!hasItems && inputValue?.length) return null;

  return (
    <ComboboxPrimitive.GroupLabel
      className={cx(styles['group-label'], className)}
      data-slot='combobox-group-label'
      {...props}
    />
  );
};
ComboboxGroupLabel.displayName = 'Combobox.GroupLabel';

export const ComboboxGroup = ({
  className,
  children,
  ...props
}: ComboboxPrimitive.Group.Props) => {
  const { inputValue, hasItems } = useComboboxContext();
  if (!hasItems && inputValue?.length) return children;

  return (
    <ComboboxPrimitive.Group
      className={cx(styles.group, className)}
      data-slot='combobox-group'
      {...props}
    >
      {children}
    </ComboboxPrimitive.Group>
  );
};
ComboboxGroup.displayName = 'Combobox.Group';

export const ComboboxSeparator = ({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) => {
  const { inputValue, hasItems } = useComboboxContext();
  if (!hasItems && inputValue?.length) return null;

  return (
    <ComboboxPrimitive.Separator
      className={cx(styles.separator, className)}
      data-slot='combobox-separator'
      {...props}
    />
  );
};
ComboboxSeparator.displayName = 'Combobox.Separator';

export interface ComboboxClearProps extends ComboboxPrimitive.Clear.Props {
  /** @default 2 */
  size?: IconButtonProps['size'];
}

export const ComboboxClear = ({
  className,
  children = <ClearIcon />,
  size = 2,
  'aria-label': ariaLabel = 'Clear',
  ...props
}: ComboboxClearProps) => (
  <ComboboxPrimitive.Clear
    render={<IconButton size={size} />}
    className={cx(styles.clear, className)}
    aria-label={ariaLabel}
    data-slot='combobox-clear'
    {...props}
  >
    {children}
  </ComboboxPrimitive.Clear>
);
ComboboxClear.displayName = 'Combobox.Clear';

export const ComboboxEmpty = ({
  className,
  ...props
}: ComboboxPrimitive.Empty.Props) => (
  <ComboboxPrimitive.Empty
    className={cx(styles.empty, className)}
    data-slot='combobox-empty'
    {...props}
  />
);
ComboboxEmpty.displayName = 'Combobox.Empty';

const isGroup = (item: unknown): item is { items: readonly unknown[] } =>
  typeof item === 'object' &&
  item !== null &&
  Array.isArray((item as { items?: unknown }).items);

const countItems = (items: readonly unknown[]) =>
  items.reduce<number>(
    (count, item) => count + (isGroup(item) ? item.items.length : 1),
    0
  );

export interface ComboboxStatusProps
  extends Omit<ComboboxPrimitive.Status.Props, 'children'> {
  /** Text to announce. A function receives the number of matching items, or `null` without the `items` prop. */
  children?: ReactNode | ((count: number | null) => ReactNode);
}

export const ComboboxStatus = ({
  className,
  children,
  ...props
}: ComboboxStatusProps) => {
  const { hasItems } = useComboboxContext();
  const filteredItems = ComboboxPrimitive.useFilteredItems<unknown>();

  const content =
    typeof children === 'function'
      ? children(hasItems ? countItems(filteredItems) : null)
      : children;

  return (
    <ComboboxPrimitive.Status
      className={cx(styles['visually-hidden'], className)}
      data-slot='combobox-status'
      {...props}
    >
      {content}
    </ComboboxPrimitive.Status>
  );
};
ComboboxStatus.displayName = 'Combobox.Status';
