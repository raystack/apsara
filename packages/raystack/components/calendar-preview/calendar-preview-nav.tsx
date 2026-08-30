'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '~/icons';
import { IconButton } from '../icon-button';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';
import {
  addMonths,
  endOfMonth,
  formatDate,
  startOfMonth
} from './date-adapter';

export interface CalendarPreviewNavProps
  extends Omit<ComponentProps<'div'>, 'children'> {
  /**
   * Where the caption sits relative to the buttons.
   * @defaultValue 'start'
   */
  align?: 'start' | 'end';
  /**
   * Month-caption format, passed to the date adapter.
   * @defaultValue 'MMMM YYYY'
   */
  captionFormat?: string;
}

/**
 * Caption plus previous / next buttons. **Ours, not react-day-picker's** —
 * `.Grid` runs with `hideNavigation` and `captionLayout='label'`, so RDP never
 * mounts a `Select` and the unmount loop that disabled `captionLayout` has no
 * surface to occur on.
 *
 * The design places a third button here, left of the chevrons. Its action is
 * unsettled (RFC 005 open item 9), so it is deliberately not built yet.
 */
export function CalendarPreviewNav({
  className,
  align = 'start',
  captionFormat = 'MMMM YYYY',
  ...props
}: CalendarPreviewNavProps) {
  const { month, setMonth, minDate, maxDate, disabled, timeZone } =
    useCalendarPreviewContext('Nav');

  const previousMonth = addMonths(month, -1, timeZone);
  const nextMonth = addMonths(month, 1, timeZone);

  /*
   * A step is offered when the target month holds at least one selectable day.
   * Testing only its first day would strand a `minDate` that falls mid-month.
   */
  const monthIsReachable = (target: Date) => {
    if (minDate && endOfMonth(target, timeZone) < minDate) return false;
    if (maxDate && startOfMonth(target, timeZone) > maxDate) return false;
    return true;
  };

  const canGoBack = !disabled && monthIsReachable(previousMonth);
  const canGoForward = !disabled && monthIsReachable(nextMonth);

  return (
    <div
      className={cx(styles.nav, className)}
      data-align={align}
      data-slot='calendar-preview-nav'
      {...props}
    >
      <span
        className={styles.navCaption}
        aria-live='polite'
        data-slot='calendar-preview-nav-caption'
      >
        {formatDate(month, captionFormat, timeZone)}
      </span>
      <div className={styles.navButtons}>
        <IconButton
          size={3}
          aria-label='Previous month'
          disabled={!canGoBack}
          onClick={() => setMonth(previousMonth)}
          data-slot='calendar-preview-nav-previous'
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          size={3}
          aria-label='Next month'
          disabled={!canGoForward}
          onClick={() => setMonth(nextMonth)}
          data-slot='calendar-preview-nav-next'
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
    </div>
  );
}

CalendarPreviewNav.displayName = 'CalendarPreview.Nav';
