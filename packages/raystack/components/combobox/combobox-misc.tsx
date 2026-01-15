'use client';

import {
  ComboboxGroup as AriakitComboboxGroup,
  ComboboxGroupLabel as AriakitComboboxGroupLabel,
  ComboboxSeparator as AriakitComboboxSeparator
} from '@ariakit/react';
import { cx } from 'class-variance-authority';
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import styles from './combobox.module.css';
import { useComboboxContext } from './combobox-root';

export const ComboboxLabel = forwardRef<
  ElementRef<typeof AriakitComboboxGroupLabel>,
  ComponentPropsWithoutRef<typeof AriakitComboboxGroupLabel>
>(({ className, ...props }, ref) => {
  const { inputValue } = useComboboxContext();
  if (inputValue?.length) return null;

  return (
    <AriakitComboboxGroupLabel
      ref={ref}
      className={cx(styles.label, className)}
      {...props}
    />
  );
});
ComboboxLabel.displayName = 'ComboboxLabel';

export const ComboboxGroup = forwardRef<
  ElementRef<typeof AriakitComboboxGroup>,
  ComponentPropsWithoutRef<typeof AriakitComboboxGroup>
>(({ className, children, ...props }, ref) => {
  const { inputValue } = useComboboxContext();
  if (inputValue?.length) return children;

  return (
    <AriakitComboboxGroup
      ref={ref}
      className={cx(styles.group, className)}
      {...props}
    >
      {children}
    </AriakitComboboxGroup>
  );
});
ComboboxGroup.displayName = 'ComboboxGroup';

export const ComboboxSeparator = forwardRef<
  ElementRef<typeof AriakitComboboxSeparator>,
  ComponentPropsWithoutRef<typeof AriakitComboboxSeparator>
>(({ className, ...props }, ref) => {
  const { inputValue } = useComboboxContext();
  if (inputValue?.length) return null;

  return (
    <AriakitComboboxSeparator
      ref={ref}
      className={cx(styles.separator, className)}
      {...props}
    />
  );
});
ComboboxSeparator.displayName = 'ComboboxSeparator';
