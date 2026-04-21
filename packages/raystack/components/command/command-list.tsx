'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import { cx } from 'class-variance-authority';
import styles from './command.module.css';

export type CommandListProps = AutocompletePrimitive.List.Props;

export const CommandList = ({
  ref,
  className,
  ...props
}: CommandListProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <AutocompletePrimitive.List
      ref={ref}
      className={cx(styles.list, className)}
      {...props}
    />
  );
};

CommandList.displayName = 'Command.List';
