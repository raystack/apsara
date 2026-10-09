'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { Fragment, useContext } from 'react';
import styles from './select.module.css';
import { SelectRegistrationContext, useSelectContext } from './select-root';

export interface SelectGroupProps extends SelectPrimitive.Group.Props {}

export function SelectGroup({
  className,
  children,
  ...props
}: SelectGroupProps) {
  const { shouldFilter, autocomplete } = useSelectContext();
  const registering = useContext(SelectRegistrationContext);

  if (shouldFilter || registering) return <Fragment>{children}</Fragment>;

  const GroupPrimitive = autocomplete
    ? ComboboxPrimitive.Group
    : SelectPrimitive.Group;

  return (
    <GroupPrimitive
      className={cx(styles.menugroup, className)}
      data-slot='select-group'
      {...props}
    >
      {children}
    </GroupPrimitive>
  );
}
SelectGroup.displayName = 'Select.Group';

export interface SelectGroupLabelProps
  extends SelectPrimitive.GroupLabel.Props {}

export function SelectGroupLabel({
  className,
  ...props
}: SelectGroupLabelProps) {
  const { shouldFilter, autocomplete } = useSelectContext();
  const registering = useContext(SelectRegistrationContext);

  if (shouldFilter || registering) return null;

  const LabelPrimitive = autocomplete
    ? ComboboxPrimitive.GroupLabel
    : SelectPrimitive.GroupLabel;

  return (
    <LabelPrimitive
      className={cx(styles.groupLabel, className)}
      data-slot='select-group-label'
      {...props}
    />
  );
}
SelectGroupLabel.displayName = 'Select.GroupLabel';

export interface SelectLabelProps extends SelectPrimitive.Label.Props {}

export function SelectLabel({ className, ...props }: SelectLabelProps) {
  const { autocomplete } = useSelectContext();

  const LabelPrimitive = autocomplete
    ? ComboboxPrimitive.Label
    : SelectPrimitive.Label;

  return (
    <LabelPrimitive
      className={cx(styles.label, className)}
      data-slot='select-label'
      {...props}
    />
  );
}
SelectLabel.displayName = 'Select.Label';

export interface SelectEmptyProps extends ComboboxPrimitive.Empty.Props {}

export function SelectEmpty({
  className,
  children,
  ...props
}: SelectEmptyProps) {
  const { autocomplete, hasItems } = useSelectContext();

  if (!autocomplete) return null;

  // Base UI counts matches from the root `items`. Without them it always reports an empty list.
  return (
    <ComboboxPrimitive.Empty
      className={cx(styles.empty, className)}
      data-slot='select-empty'
      {...props}
    >
      {hasItems ? children : null}
    </ComboboxPrimitive.Empty>
  );
}
SelectEmpty.displayName = 'Select.Empty';

export interface SelectStatusProps extends ComboboxPrimitive.Status.Props {}

export function SelectStatus({ className, ...props }: SelectStatusProps) {
  const { autocomplete } = useSelectContext();

  if (!autocomplete) return null;

  return (
    <ComboboxPrimitive.Status
      className={cx(styles.status, className)}
      data-slot='select-status'
      {...props}
    />
  );
}
SelectStatus.displayName = 'Select.Status';

export interface SelectSeparatorProps extends SelectPrimitive.Separator.Props {}

export function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  const { shouldFilter, autocomplete } = useSelectContext();
  const registering = useContext(SelectRegistrationContext);

  if (shouldFilter || registering) return null;

  const SeparatorPrimitive = autocomplete
    ? ComboboxPrimitive.Separator
    : SelectPrimitive.Separator;

  return (
    <SeparatorPrimitive
      className={cx(styles.separator, className)}
      data-slot='select-separator'
      {...props}
    />
  );
}
SelectSeparator.displayName = 'Select.Separator';
