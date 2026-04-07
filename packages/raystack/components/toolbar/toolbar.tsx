'use client';

import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';
import { cx } from 'class-variance-authority';
import { Button } from '../button';
import styles from './toolbar.module.css';

const ToolbarRoot = ({ className, ...props }: ToolbarPrimitive.Root.Props) => (
  <ToolbarPrimitive.Root className={cx(styles.root, className)} {...props} />
);
ToolbarRoot.displayName = 'Toolbar';

const ToolbarButton = ({
  className,
  ...props
}: ToolbarPrimitive.Button.Props) => (
  <ToolbarPrimitive.Button
    className={cx(styles.button, className)}
    render={<Button variant='text' color='neutral' size='small' />}
    {...props}
  />
);
ToolbarButton.displayName = 'Toolbar.Button';

const ToolbarGroup = ({
  className,
  ...props
}: ToolbarPrimitive.Group.Props) => (
  <ToolbarPrimitive.Group className={cx(styles.group, className)} {...props} />
);
ToolbarGroup.displayName = 'Toolbar.Group';

const ToolbarSeparator = ({
  className,
  ...props
}: ToolbarPrimitive.Separator.Props) => (
  <ToolbarPrimitive.Separator
    className={cx(styles.separator, className)}
    {...props}
  />
);
ToolbarSeparator.displayName = 'Toolbar.Separator';

export const Toolbar = Object.assign(ToolbarRoot, {
  Button: ToolbarButton,
  Group: ToolbarGroup,
  Separator: ToolbarSeparator
});
