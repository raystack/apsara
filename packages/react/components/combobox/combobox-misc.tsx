'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ClearIcon } from '~/icons';
import { IconButton } from '../icon-button';
import type { IconButtonProps } from '../icon-button/icon-button';
import { Label, type LabelProps } from '../label';
import styles from './combobox.module.css';
import { useComboboxContext, useMatchCount } from './combobox-root';

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
  children = 'No results',
  ...props
}: ComboboxPrimitive.Empty.Props) => {
  const { hasItems } = useComboboxContext();
  const matchCount = useMatchCount();
  // Base UI only knows the filtered list when `items` is set on the root.
  const showChildren = hasItems || matchCount === 0;

  return (
    <ComboboxPrimitive.Empty
      className={cx(styles.empty, className)}
      data-slot='combobox-empty'
      {...props}
    >
      {showChildren ? children : null}
    </ComboboxPrimitive.Empty>
  );
};
ComboboxEmpty.displayName = 'Combobox.Empty';

function countLeaves(items: readonly unknown[]) {
  let count = 0;
  for (const item of items) {
    const group =
      typeof item === 'object' && item !== null && 'items' in item
        ? item.items
        : undefined;
    count += Array.isArray(group) ? group.length : 1;
  }
  return count;
}

export const ComboboxStatus = ({
  className,
  children,
  ...props
}: ComboboxPrimitive.Status.Props) => {
  const { inputValue, hasItems } = useComboboxContext();
  const filteredItems = ComboboxPrimitive.useFilteredItems();
  const matchCount = useMatchCount();
  const count = hasItems ? countLeaves(filteredItems) : matchCount;
  // Combobox.Empty announces the zero case.
  const message =
    inputValue && count > 0
      ? `${count} ${count === 1 ? 'result' : 'results'}`
      : null;

  return (
    <ComboboxPrimitive.Status
      className={cx(styles['visually-hidden'], className)}
      data-slot='combobox-status'
      {...props}
    >
      {children ?? message}
    </ComboboxPrimitive.Status>
  );
};
ComboboxStatus.displayName = 'Combobox.Status';
