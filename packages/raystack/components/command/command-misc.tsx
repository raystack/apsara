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

export type CommandShortcutProps = ComponentProps<'span'>;

export const CommandShortcut = ({
  className,
  children,
  ...props
}: CommandShortcutProps) => {
  const keys =
    typeof children === 'string'
      ? children.trim().split(/\s+/).filter(Boolean)
      : Array.isArray(children)
        ? children
        : [children];

  return (
    <span className={cx(styles.shortcut, className)} {...props}>
      {keys.map((key, index) => (
        <kbd key={index} className={styles.shortcutKey}>
          {key}
        </kbd>
      ))}
    </span>
  );
};
CommandShortcut.displayName = 'Command.Shortcut';
