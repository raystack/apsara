'use client';

import { cx } from 'class-variance-authority';
import { type ComponentProps } from 'react';
import styles from './command.module.css';

export interface CommandEmptyProps extends ComponentProps<'div'> {}

export const CommandEmpty = ({
  ref,
  className,
  ...props
}: CommandEmptyProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} className={cx(styles.empty, className)} {...props} />;
};

CommandEmpty.displayName = 'Command.Empty';
