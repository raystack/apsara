'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import { cx } from 'class-variance-authority';
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
      data-slot='command-group'
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
      data-slot='command-label'
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
      data-slot='command-separator'
      className={cx(styles.separator, className)}
      {...props}
    />
  );
};
CommandSeparator.displayName = 'Command.Separator';
