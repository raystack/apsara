'use client';

import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';
import { cx } from 'class-variance-authority';
import { Separator } from '../separator';
import styles from './floating-actions.module.css';

export type FloatingActionsVariant = 'inline' | 'floating';
export type FloatingActionsSide = 'top' | 'bottom';
export type FloatingActionsAlign = 'start' | 'center' | 'end';

export interface FloatingActionsProps
  extends Omit<ToolbarPrimitive.Root.Props, 'disabled'> {
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

export const FloatingActionsRoot = ({
  className,
  variant = 'floating',
  side = 'bottom',
  align = 'center',
  ...props
}: FloatingActionsProps) => (
  <ToolbarPrimitive.Root
    data-variant={variant}
    data-side={side}
    data-align={align}
    className={cx(styles.root, className)}
    {...props}
  />
);
FloatingActionsRoot.displayName = 'FloatingActions';

export type FloatingActionsGroupProps = Omit<
  ToolbarPrimitive.Group.Props,
  'disabled'
>;

export const FloatingActionsGroup = ({
  className,
  ...props
}: FloatingActionsGroupProps) => (
  <ToolbarPrimitive.Group className={cx(styles.group, className)} {...props} />
);
FloatingActionsGroup.displayName = 'FloatingActions.Group';

export type FloatingActionsSeparatorProps = Omit<
  React.ComponentProps<typeof Separator>,
  'orientation'
>;

export const FloatingActionsSeparator = ({
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
