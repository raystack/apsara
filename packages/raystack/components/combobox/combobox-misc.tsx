'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './combobox.module.css';
import { useComboboxContext } from './combobox-root';

export const ComboboxLabel = ({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) => {
  const { inputValue, hasItems } = useComboboxContext();
  if (!hasItems && inputValue?.length) return null;

  return (
    <ComboboxPrimitive.GroupLabel
      className={cx(styles.label, className)}
      {...props}
    />
  );
};
ComboboxLabel.displayName = 'Combobox.Label';

export const ComboboxGroup = ({
  className,
  children,
  ...props
}: ComboboxPrimitive.Group.Props) => {
  const { inputValue, hasItems } = useComboboxContext();
  if (!hasItems && inputValue?.length) return children;

  return (
    <ComboboxPrimitive.Group className={cx(styles.group, className)} {...props}>
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
      {...props}
    />
  );
};
ComboboxSeparator.displayName = 'Combobox.Separator';
