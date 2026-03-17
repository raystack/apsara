'use client';

import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';
import { Button } from '../button';
import styles from './toolbar.module.css';

const ToolbarRoot = forwardRef<
  ElementRef<typeof ToolbarPrimitive.Root>,
  ToolbarPrimitive.Root.Props
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Root
    ref={ref}
    className={cx(styles.root, className)}
    {...props}
  />
));
ToolbarRoot.displayName = 'Toolbar';

const ToolbarButton = forwardRef<
  ElementRef<typeof ToolbarPrimitive.Button>,
  ToolbarPrimitive.Button.Props
>((props, ref) => (
  <ToolbarPrimitive.Button
    ref={ref}
    render={<Button variant='text' color='neutral' size='small' />}
    {...props}
  />
));
ToolbarButton.displayName = 'Toolbar.Button';

const ToolbarGroup = forwardRef<
  ElementRef<typeof ToolbarPrimitive.Group>,
  ToolbarPrimitive.Group.Props
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Group
    ref={ref}
    className={cx(styles.group, className)}
    {...props}
  />
));
ToolbarGroup.displayName = 'Toolbar.Group';

const ToolbarSeparator = forwardRef<
  ElementRef<typeof ToolbarPrimitive.Separator>,
  ToolbarPrimitive.Separator.Props
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Separator
    ref={ref}
    className={cx(styles.separator, className)}
    {...props}
  />
));
ToolbarSeparator.displayName = 'Toolbar.Separator';

export const Toolbar = Object.assign(ToolbarRoot, {
  Button: ToolbarButton,
  Group: ToolbarGroup,
  Separator: ToolbarSeparator
});
