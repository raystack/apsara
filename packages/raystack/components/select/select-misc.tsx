'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { Fragment, forwardRef, ReactNode } from 'react';
import styles from './select.module.css';
import { useSelectContext } from './select-root';

export interface SelectGroupProps {
  className?: string;
  children?: ReactNode;
}

export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, children, ...props }, ref) => {
    const { shouldFilter, autocomplete } = useSelectContext();

    if (shouldFilter) return <Fragment>{children}</Fragment>;

    const GroupPrimitive = autocomplete
      ? ComboboxPrimitive.Group
      : SelectPrimitive.Group;

    return (
      <GroupPrimitive
        ref={ref}
        className={cx(styles.menugroup, className)}
        {...props}
      >
        {children}
      </GroupPrimitive>
    );
  }
);
SelectGroup.displayName = 'Select.Group';

export interface SelectLabelProps {
  className?: string;
  children?: ReactNode;
}

export const SelectLabel = forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, ...props }, ref) => {
    const { shouldFilter, autocomplete } = useSelectContext();

    if (shouldFilter) return null;

    const LabelPrimitive = autocomplete
      ? ComboboxPrimitive.GroupLabel
      : SelectPrimitive.GroupLabel;

    return (
      <LabelPrimitive
        ref={ref}
        className={cx(styles.label, className)}
        {...props}
      />
    );
  }
);
SelectLabel.displayName = 'Select.Label';

export interface SelectSeparatorProps {
  className?: string;
}

export const SelectSeparator = forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => {
    const { shouldFilter, autocomplete } = useSelectContext();

    if (shouldFilter) return null;

    const SeparatorPrimitive = autocomplete
      ? ComboboxPrimitive.Separator
      : SelectPrimitive.Separator;

    return (
      <SeparatorPrimitive
        ref={ref}
        className={cx(styles.separator, className)}
        {...props}
      />
    );
  }
);
SelectSeparator.displayName = 'Select.Separator';
