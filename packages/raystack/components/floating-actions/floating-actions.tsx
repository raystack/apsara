'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { Separator } from '../separator';
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

export type FloatingActionsSeparatorProps = ComponentProps<typeof Separator>;

const FloatingActionsSeparator = ({
  orientation = 'vertical',
  size = 'full',
  ...props
}: FloatingActionsSeparatorProps) => (
  <Separator orientation={orientation} size={size} {...props} />
);
FloatingActionsSeparator.displayName = 'FloatingActions.Separator';

export const FloatingActions = Object.assign(FloatingActionsRoot, {
  Separator: FloatingActionsSeparator
});
