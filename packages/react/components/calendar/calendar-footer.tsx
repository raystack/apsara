'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { Flex } from '../flex';
import { Text } from '../text';
import styles from './calendar.module.css';

export type CalendarFooterProps = ComponentProps<typeof Flex>;

export function CalendarFooter({
  className,
  children,
  ...props
}: CalendarFooterProps) {
  return (
    <Flex
      align='center'
      justify='center'
      className={cx(styles.footer, className)}
      data-slot='calendar-footer'
      {...props}
    >
      {typeof children === 'string' ? (
        <Text size='small' color='secondary' data-slot='calendar-footer-text'>
          {children}
        </Text>
      ) : (
        children
      )}
    </Flex>
  );
}

CalendarFooter.displayName = 'Calendar.Footer';
