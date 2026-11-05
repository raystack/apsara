'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ComponentProps, Fragment } from 'react';
import { Label, type LabelProps } from '../label';
import { getMatch } from '../menu/utils';
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

  if (shouldFilter) return null;

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

export interface SelectEmptyProps extends ComponentProps<'div'> {}

export function SelectEmpty({
  className,
  children,
  ...props
}: SelectEmptyProps) {
  const { autocomplete, autocompleteMode, items, searchValue } =
    useSelectContext();

  const hasMatch = Object.values(items).some(
    item =>
      autocompleteMode === 'manual' ||
      getMatch(item.value, item.children, searchValue)
  );

  // Base UI's Empty counts only root `items`, so the match check happens here.
  // Its live region must stay mounted to announce, so only the children toggle.
  const EmptyPrimitive = autocomplete ? ComboboxPrimitive.Empty : 'div';

  return (
    <EmptyPrimitive
      className={cx(styles.empty, className)}
      data-slot='select-empty'
      {...props}
    >
      {hasMatch ? null : children}
    </EmptyPrimitive>
  );
}
SelectEmpty.displayName = 'Select.Empty';

export type SelectLabelProps = SelectPrimitive.Label.Props & LabelProps;

export function SelectLabel({
  required,
  optionalText,
  requiredText,
  ...props
}: SelectLabelProps) {
  const { autocomplete } = useSelectContext();

  const LabelPrimitive = autocomplete
    ? ComboboxPrimitive.Label
    : SelectPrimitive.Label;

  return (
    <LabelPrimitive
      render={
        <Label
          required={required}
          optionalText={optionalText}
          requiredText={requiredText}
        />
      }
      data-slot='select-label'
      {...props}
    />
  );
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
      data-slot='select-separator'
      {...props}
    />
  );
}
SelectSeparator.displayName = 'Select.Separator';
