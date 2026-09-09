'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { UndoIcon } from '~/icons';
import { IconButton } from '../icon-button';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';
import type { CalendarPreviewValue } from './calendar-preview-root';
import { dayKey } from './date-adapter';

export type CalendarPreviewResetProps = ComponentProps<typeof IconButton>;

/**
 * Restores `defaultDate` — a day, or a range at range selection — or clears
 * the selection when it is `null`. A value
 * reset, not a view reset — it leaves the
 * visible month alone. Keyed off `defaultDate` rather than `defaultValue` so
 * it still shows under a controlled `value`.
 *
 * With nothing to restore it stays mounted and disabled rather than
 * unmounting: unmounting the focused element sends focus to `<body>`, which
 * strands a keyboard user mid-calendar, and removing a `flex: none` child
 * from the header re-flows both nav buttons sideways every time the value
 * crosses the default.
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

  /* Both edges have to match: a shared start is not a restored range. */
  const restored =
    defaultDate === null
      ? value == null
      : value != null &&
        (defaultDate instanceof Date
          ? value instanceof Date && sameDay(value, defaultDate)
          : !(value instanceof Date) &&
            sameDay(value.from, defaultDate.from) &&
            sameDay(value.to, defaultDate.to));

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
