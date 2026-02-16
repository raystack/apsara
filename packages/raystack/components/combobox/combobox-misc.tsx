'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';
import styles from './combobox.module.css';
import { useComboboxContext } from './combobox-root';

export const ComboboxLabel = forwardRef<
  ElementRef<typeof ComboboxPrimitive.GroupLabel>,
  ComboboxPrimitive.GroupLabel.Props
>(({ className, ...props }, ref) => {
  const { inputValue, hasItems } = useComboboxContext();
  if (!hasItems && inputValue?.length) return null;

  return (
    <ComboboxPrimitive.GroupLabel
      ref={ref}
      className={cx(styles.label, className)}
      {...props}
    />
  );
});
ComboboxLabel.displayName = 'Combobox.Label';

export const ComboboxGroup = forwardRef<
  ElementRef<typeof ComboboxPrimitive.Group>,
  ComboboxPrimitive.Group.Props
>(({ className, children, ...props }, ref) => {
  const { inputValue, hasItems } = useComboboxContext();
  if (!hasItems && inputValue?.length) return children;

  return (
    <ComboboxPrimitive.Group
      ref={ref}
      className={cx(styles.group, className)}
      {...props}
    >
      {children}
    </ComboboxPrimitive.Group>
  );
});
ComboboxGroup.displayName = 'Combobox.Group';

export const ComboboxSeparator = forwardRef<
  ElementRef<typeof ComboboxPrimitive.Separator>,
  ComboboxPrimitive.Separator.Props
>(({ className, ...props }, ref) => {
  const { inputValue, hasItems } = useComboboxContext();
  if (!hasItems && inputValue?.length) return null;

  return (
    <ComboboxPrimitive.Separator
      ref={ref}
      className={cx(styles.separator, className)}
      {...props}
    />
  );
});
ComboboxSeparator.displayName = 'Combobox.Separator';
