'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import { cx } from 'class-variance-authority';
import styles from './command.module.css';

export type CommandContentProps = AutocompletePrimitive.List.Props;

export const CommandContent = ({
  ref,
  className,
  ...props
}: CommandContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <AutocompletePrimitive.List
      ref={ref}
      className={cx(styles.list, className)}
      {...props}
    />
  );
};

CommandContent.displayName = 'Command.Content';
