'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ElementRef, Fragment, forwardRef } from 'react';
import styles from './select.module.css';
import { useSelectContext } from './select-root';

export const SelectGroup = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children, ...props }, ref) => {
  const { mode, shouldFilter } = useSelectContext();

  if (shouldFilter) return <Fragment>{children}</Fragment>;

  if (mode === 'combobox') {
    return (
      <ComboboxPrimitive.Group
        ref={ref}
        className={cx(styles.menugroup, className)}
        {...props}
      >
        {children}
      </ComboboxPrimitive.Group>
    );
  }

  return (
    <SelectPrimitive.Group
      ref={ref as React.Ref<ElementRef<typeof SelectPrimitive.Group>>}
      className={cx(styles.menugroup, className)}
      {...props}
    >
      {children}
    </SelectPrimitive.Group>
  );
});
SelectGroup.displayName = 'Select.Group';

export const SelectLabel = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, ...props }, ref) => {
  const { mode, shouldFilter } = useSelectContext();

  if (shouldFilter) return null;

  if (mode === 'combobox') {
    return (
      <ComboboxPrimitive.GroupLabel
        ref={ref}
        className={cx(styles.label, className)}
        {...props}
      />
    );
  }

  return (
    <SelectPrimitive.GroupLabel
      ref={ref as React.Ref<ElementRef<typeof SelectPrimitive.GroupLabel>>}
      className={cx(styles.label, className)}
      {...props}
    />
  );
});
SelectLabel.displayName = 'Select.Label';

export const SelectSeparator = forwardRef<
  HTMLDivElement,
  { className?: string }
>(({ className, ...props }, ref) => {
  const { mode, shouldFilter } = useSelectContext();

  if (shouldFilter) return null;

  if (mode === 'combobox') {
    return (
      <ComboboxPrimitive.Separator
        ref={ref}
        className={cx(styles.separator, className)}
        {...props}
      />
    );
  }

  // Base UI Select doesn't have a Separator primitive, use a styled div
  return (
    <div
      ref={ref}
      role='separator'
      className={cx(styles.separator, className)}
      {...props}
    />
  );
});
SelectSeparator.displayName = 'Select.Separator';
