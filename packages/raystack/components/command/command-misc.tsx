'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import { cx } from 'class-variance-authority';
import { type ComponentProps } from 'react';
import styles from './command.module.css';
import { useCommandContext } from './command-root';

export type CommandGroupProps = AutocompletePrimitive.Group.Props;

export const CommandGroup = ({
  className,
  children,
  ...props
}: CommandGroupProps) => {
  const { inputValue, hasItems } = useCommandContext();
  if (!hasItems && inputValue?.length) return <>{children}</>;

  return (
    <AutocompletePrimitive.Group
      className={cx(styles.group, className)}
      {...props}
    >
      {children}
    </AutocompletePrimitive.Group>
  );
};
CommandGroup.displayName = 'Command.Group';

export type CommandLabelProps = AutocompletePrimitive.GroupLabel.Props;

export const CommandLabel = ({ className, ...props }: CommandLabelProps) => {
  const { inputValue, hasItems } = useCommandContext();
  if (!hasItems && inputValue?.length) return null;

  return (
    <AutocompletePrimitive.GroupLabel
      className={cx(styles.label, className)}
      {...props}
    />
  );
};
CommandLabel.displayName = 'Command.Label';

export type CommandSeparatorProps = AutocompletePrimitive.Separator.Props;

export const CommandSeparator = ({
  className,
  ...props
}: CommandSeparatorProps) => {
  const { inputValue, hasItems } = useCommandContext();
  if (!hasItems && inputValue?.length) return null;

  return (
    <AutocompletePrimitive.Separator
      className={cx(styles.separator, className)}
      {...props}
    />
  );
};
CommandSeparator.displayName = 'Command.Separator';

export type CommandShortcutProps = ComponentProps<'kbd'>;

export const CommandShortcut = ({
  className,
  ...props
}: CommandShortcutProps) => (
  <kbd className={cx(styles.shortcut, className)} {...props} />
);
CommandShortcut.displayName = 'Command.Shortcut';

export type CommandFooterProps = ComponentProps<'div'>;

export const CommandFooter = ({ className, ...props }: CommandFooterProps) => (
  <div className={cx(styles.footer, className)} {...props} />
);
CommandFooter.displayName = 'Command.Footer';

export type CommandPanelProps = ComponentProps<'div'>;

export const CommandPanel = ({ className, ...props }: CommandPanelProps) => (
  <div className={cx(styles.panel, className)} {...props} />
);
CommandPanel.displayName = 'Command.Panel';

export const CommandCollection = AutocompletePrimitive.Collection;
