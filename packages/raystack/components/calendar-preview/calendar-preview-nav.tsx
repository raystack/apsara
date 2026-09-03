'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, UndoIcon } from '~/icons';
import { IconButton } from '../icon-button';
import { Skeleton } from '../skeleton';
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
  /**
   * How many months the grid beside this nav shows. Keep it in step with
   * `.Grid`'s `months`, or the caption will name a month the grid does not
   * show on its own.
   * @defaultValue 1
   */
  months?: 1 | 2;
}

/**
 * Caption, a revert button, and previous / next. **Ours, not
 * react-day-picker's** — `.Grid` runs with `hideNavigation` and
 * `captionLayout='label'`, so RDP never mounts a `Select` and the unmount loop
 * that disabled `captionLayout` has no surface to occur on.
 *
 * The revert button appears only when the root was given a `defaultValue` and
 * the current value differs from it; pressing it restores that default. It is
 * absent otherwise rather than disabled, because a control that can never do
 * anything is noise.
 */
export function CalendarPreviewNav({
  className,
  align = 'start',
  captionFormat = 'MMMM YYYY',
  months = 1,
  ...props
}: CalendarPreviewNavProps) {
  const {
    month,
    setMonth,
    minDate,
    maxDate,
    disabled,
    readOnly,
    timeZone,
    granularity,
    loading,
    canReset,
    resetValue
  } = useCalendarPreviewContext('Nav');

  /*
   * Month stepping only makes sense for the day granularity, and the design
   * hides this header entirely in its month variant. `.MonthGrid` scrolls
   * rather than pages, so it needs no nav of its own.
   */
  if (granularity !== 'day') return null;

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
      {loading ? (
        /* The slot goes on a wrapper: `Skeleton` does not spread unknown
           props, so one passed to it is dropped rather than rendered. */
        <span aria-busy='true' data-slot='calendar-preview-skeleton'>
          <Skeleton width='var(--rs-space-12)' height='var(--rs-space-5)' />
        </span>
      ) : (
        <span
          className={styles.navCaption}
          aria-live='polite'
          data-slot='calendar-preview-nav-caption'
        >
          {months > 1
            ? `${formatDate(month, captionFormat, timeZone)} – ${formatDate(
                addMonths(month, months - 1, timeZone),
                captionFormat,
                timeZone
              )}`
            : formatDate(month, captionFormat, timeZone)}
        </span>
      )}
      <div className={styles.navButtons}>
        {canReset && (
          <IconButton
            size={3}
            aria-label='Reset to default date'
            disabled={disabled || readOnly}
            onClick={resetValue}
            data-slot='calendar-preview-nav-undo'
          >
            <UndoIcon />
          </IconButton>
        )}
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
