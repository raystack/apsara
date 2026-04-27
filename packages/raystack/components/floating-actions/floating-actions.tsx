'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { Separator } from '../separator';
import styles from './floating-actions.module.css';

export type FloatingActionsVariant = 'inline' | 'floating';
export type FloatingActionsSide = 'top' | 'bottom';
export type FloatingActionsAlign = 'start' | 'center' | 'end';

export interface FloatingActionsProps extends ComponentProps<'div'> {
  /**
   * Visual layout. `floating` pins the bar to the viewport via
   * `position: fixed`; `inline` renders in normal document flow.
   * @defaultValue "floating"
   */
  variant?: FloatingActionsVariant;
  /**
   * Vertical edge to anchor to. Only applies when `variant="floating"`.
   * @defaultValue "bottom"
   */
  side?: FloatingActionsSide;
  /**
   * Horizontal alignment along the chosen side. Only applies when
   * `variant="floating"`.
   * @defaultValue "center"
   */
  align?: FloatingActionsAlign;
}

const FloatingActionsRoot = ({
  className,
  role = 'toolbar',
  variant = 'floating',
  side = 'bottom',
  align = 'center',
  ...props
}: FloatingActionsProps) => (
  <div
    role={role}
    data-variant={variant}
    data-side={side}
    data-align={align}
    className={cx(styles.root, className)}
    {...props}
  />
);
FloatingActionsRoot.displayName = 'FloatingActions';

export type FloatingActionsSeparatorProps = Omit<
  ComponentProps<typeof Separator>,
  'orientation'
>;

const FloatingActionsSeparator = ({
  className,
  ...props
}: FloatingActionsSeparatorProps) => (
  <Separator
    orientation='vertical'
    className={cx(styles.separator, className)}
    {...props}
  />
);
FloatingActionsSeparator.displayName = 'FloatingActions.Separator';

export const FloatingActions = Object.assign(FloatingActionsRoot, {
  Separator: FloatingActionsSeparator
});
