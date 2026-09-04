'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { Flex } from '../flex';
import { Text } from '../text';
import styles from './calendar-preview.module.css';

export type CalendarPreviewFooterProps = ComponentProps<typeof Flex>;

/**
 * The row below the calendar.
 *
 * A bare string is wrapped in `Text` so the common case reads as
 * `<CalendarPreview.Footer>Dates are inclusive</CalendarPreview.Footer>`
 * without the caller having to know the type scale; anything else renders as
 * given.
 */
export function CalendarPreviewFooter({
  className,
  children,
  ...props
}: CalendarPreviewFooterProps) {
  return (
    <Flex
      align='center'
      justify='center'
      className={cx(styles.footer, className)}
      data-slot='calendar-preview-footer'
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          size='small'
          variant='secondary'
          data-slot='calendar-preview-footer-text'
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Flex>
  );
}

CalendarPreviewFooter.displayName = 'CalendarPreview.Footer';
