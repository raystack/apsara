'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { UndoIcon } from '~/icons';
import { IconButton } from '../icon-button';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';
import {
  type CalendarPreviewValue,
  isRange,
  isScaleValue
} from './calendar-preview-root';
import { dayKey } from './date-adapter';

export type CalendarPreviewResetProps = ComponentProps<typeof IconButton>;

/**
 * Restores `defaultDate` — a day, a range, or a period at a coarser scale — or
 * clears when it is `null`. A value reset, not a view reset: it leaves the
 * visible month alone. Keyed off `defaultDate` rather than `defaultValue` so it
 * still shows under a controlled `value`.
 *
 * With nothing to restore it stays mounted and disabled rather than unmounting:
 * that would send focus to `<body>` mid-calendar, and drop a `flex: none` child
 * that keeps both nav buttons in place.
 */
export function CalendarPreviewReset({
  className,
  children,
  onClick,
  ...props
}: CalendarPreviewResetProps) {
  const { value, defaultDate, reset, disabled, readOnly, timeZone } =
    useCalendarPreviewContext<CalendarPreviewValue>('CalendarPreview.Reset');

  /* No `defaultDate` means the part has no job at all, which is a different
     thing from having nothing to restore right now — `null` is a default. */
  if (defaultDate === undefined) return null;

  const sameDay = (a: Date, b: Date) =>
    dayKey(a, timeZone) === dayKey(b, timeZone);

  /* Both edges have to match: a shared start is not a restored range. A
     period matches on its scale as well as its day — the same day read at two
     scales is two different values. */
  const restored =
    defaultDate === null
      ? value == null
      : value != null &&
        (defaultDate instanceof Date
          ? value instanceof Date && sameDay(value, defaultDate)
          : isRange(defaultDate)
            ? isRange(value) &&
              sameDay(value.from, defaultDate.from) &&
              sameDay(value.to, defaultDate.to)
            : isScaleValue(value) &&
              value.date === defaultDate.date &&
              value.scale === defaultDate.scale);

  return (
    <IconButton
      size={3}
      className={cx(styles['nav-button'], styles.reset, className)}
      disabled={disabled || readOnly || restored}
      data-slot='calendar-preview-reset'
      data-restored={restored || undefined}
      aria-label='Reset'
      onClick={event => {
        onClick?.(event);
        reset();
      }}
      {...props}
    >
      {children ?? <UndoIcon />}
    </IconButton>
  );
}

CalendarPreviewReset.displayName = 'CalendarPreview.Reset';
