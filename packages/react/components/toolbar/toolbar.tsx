'use client';

import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';
import { cx } from 'class-variance-authority';
import { Button } from '../button';
import styles from './toolbar.module.css';

const ToolbarRoot = ({ className, ...props }: ToolbarPrimitive.Root.Props) => (
  <ToolbarPrimitive.Root
    data-slot='toolbar'
    className={cx(styles.root, className)}
    {...props}
  />
);
ToolbarRoot.displayName = 'Toolbar';

const ToolbarButton = ({
  className,
  ...props
}: ToolbarPrimitive.Button.Props) => (
  <ToolbarPrimitive.Button
    data-slot='toolbar-button'
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
  <ToolbarPrimitive.Group
    data-slot='toolbar-group'
    className={cx(styles.group, className)}
    {...props}
  />
);
ToolbarGroup.displayName = 'Toolbar.Group';

const ToolbarSeparator = ({
  className,
  ...props
}: ToolbarPrimitive.Separator.Props) => (
  <ToolbarPrimitive.Separator
    data-slot='toolbar-separator'
    className={cx(styles.separator, className)}
    {...props}
  />
);
ToolbarSeparator.displayName = 'Toolbar.Separator';

const ToolbarLink = ({ className, ...props }: ToolbarPrimitive.Link.Props) => (
  <ToolbarPrimitive.Link
    data-slot='toolbar-link'
    className={cx(styles.link, className)}
    {...props}
  />
);
ToolbarLink.displayName = 'Toolbar.Link';

const ToolbarInput = ({
  className,
  ...props
}: ToolbarPrimitive.Input.Props) => (
  <ToolbarPrimitive.Input
    data-slot='toolbar-input'
    className={cx(styles.input, className)}
    {...props}
  />
);
ToolbarInput.displayName = 'Toolbar.Input';

export const Toolbar = Object.assign(ToolbarRoot, {
  Button: ToolbarButton,
  Link: ToolbarLink,
  Input: ToolbarInput,
  Group: ToolbarGroup,
  Separator: ToolbarSeparator
});
