import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { Popover } from '../popover';
import styles from './calendar.module.css';
import { useCalendarContext } from './calendar-context';

export type CalendarContentProps = ComponentProps<typeof Popover.Content>;

export function CalendarContent({
  className,
  children,
  ...props
}: CalendarContentProps) {
  const { triggerHasInput, shouldRestoreFinalFocus } =
    useCalendarContext('Calendar.Content');

  return (
    <Popover.Content
      className={cx(styles.content, className)}
      data-slot='calendar-content'
      initialFocus={triggerHasInput ? false : undefined}
      finalFocus={triggerHasInput ? shouldRestoreFinalFocus : undefined}
      {...props}
    >
      {children}
    </Popover.Content>
  );
}

CalendarContent.displayName = 'Calendar.Content';
