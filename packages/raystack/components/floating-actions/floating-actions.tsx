'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import styles from './floating-actions.module.css';

export interface FloatingActionsProps extends ComponentProps<'div'> {}

const FloatingActionsRoot = ({
  className,
  role = 'toolbar',
  ...props
}: FloatingActionsProps) => (
  <div role={role} className={cx(styles.root, className)} {...props} />
);
FloatingActionsRoot.displayName = 'FloatingActions';

export interface FloatingActionsSeparatorProps extends ComponentProps<'div'> {}

const FloatingActionsSeparator = ({
  className,
  ...props
}: FloatingActionsSeparatorProps) => (
  <div
    aria-hidden='true'
    className={cx(styles.separator, className)}
    {...props}
  />
);
FloatingActionsSeparator.displayName = 'FloatingActions.Separator';

export const FloatingActions = Object.assign(FloatingActionsRoot, {
  Separator: FloatingActionsSeparator
});
