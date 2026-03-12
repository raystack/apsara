'use client';

import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';

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
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Button
    ref={ref}
    className={cx(styles.button, className)}
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

const ToolbarLink = forwardRef<
  ElementRef<typeof ToolbarPrimitive.Link>,
  ToolbarPrimitive.Link.Props
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Link ref={ref} className={cx(className)} {...props} />
));
ToolbarLink.displayName = 'Toolbar.Link';

const ToolbarInput = forwardRef<
  ElementRef<typeof ToolbarPrimitive.Input>,
  ToolbarPrimitive.Input.Props
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Input ref={ref} className={cx(className)} {...props} />
));
ToolbarInput.displayName = 'Toolbar.Input';

export const Toolbar = Object.assign(ToolbarRoot, {
  Button: ToolbarButton,
  Group: ToolbarGroup,
  Separator: ToolbarSeparator,
  Link: ToolbarLink,
  Input: ToolbarInput
});
