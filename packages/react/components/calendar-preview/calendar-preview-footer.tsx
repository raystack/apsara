'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { Flex } from '../flex';
import { Text } from '../text';
import styles from './calendar-preview.module.css';

export interface CalendarPreviewFooterProps
  extends ComponentProps<typeof Flex> {
  /**
   * Alignment of the items on the cross axis.
   * @default "center"
   */
  align?: ComponentProps<typeof Flex>['align'];
  /**
   * Distribution of the items on the main axis.
   * @default "center"
   */
  justify?: ComponentProps<typeof Flex>['justify'];
}

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
          color='secondary'
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
