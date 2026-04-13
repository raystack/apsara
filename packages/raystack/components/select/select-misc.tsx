'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { Fragment, ReactNode } from 'react';
import styles from './select.module.css';
import { useSelectContext } from './select-root';

export interface SelectGroupProps extends SelectPrimitive.Group.Props {}

export function SelectGroup({
  className,
  children,
  ...props
}: SelectGroupProps) {
  const { shouldFilter, autocomplete } = useSelectContext();

  if (shouldFilter) return <Fragment>{children}</Fragment>;

  const GroupPrimitive = autocomplete
    ? ComboboxPrimitive.Group
    : SelectPrimitive.Group;

  return (
    <GroupPrimitive className={cx(styles.menugroup, className)} {...props}>
      {children}
    </GroupPrimitive>
  );
}
SelectGroup.displayName = 'Select.Group';

export interface SelectLabelProps extends SelectPrimitive.GroupLabel.Props {}

export function SelectLabel({ className, ...props }: SelectLabelProps) {
  const { shouldFilter, autocomplete } = useSelectContext();

  if (shouldFilter) return null;

  const LabelPrimitive = autocomplete
    ? ComboboxPrimitive.GroupLabel
    : SelectPrimitive.GroupLabel;

  return <LabelPrimitive className={cx(styles.label, className)} {...props} />;
}
SelectLabel.displayName = 'Select.Label';

export interface SelectSeparatorProps extends SelectPrimitive.Separator.Props {}

export function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  const { shouldFilter, autocomplete } = useSelectContext();

  if (shouldFilter) return null;

  const SeparatorPrimitive = autocomplete
    ? ComboboxPrimitive.Separator
    : SelectPrimitive.Separator;

  return (
    <SeparatorPrimitive
      className={cx(styles.separator, className)}
      {...props}
    />
  );
}
SelectSeparator.displayName = 'Select.Separator';
