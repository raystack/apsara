'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { UndoIcon } from '~/icons';
import { IconButton } from '../icon-button';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { isRange, isScaleValue } from './calendar-preview-root';
import { dayKey } from './date-adapter';

export type CalendarPreviewResetProps = ComponentProps<typeof IconButton>;

/* Stays mounted and disabled rather than unmounting: that would send focus to
   `<body>` mid-calendar, and drop a `flex: none` child holding the nav. */
export function CalendarPreviewReset({
  className,
  children,
  onClick,
  disabled: disabledProp,
  ...props
}: CalendarPreviewResetProps) {
  const { value, defaultDate, reset, disabled, readOnly, timeZone } =
    useCalendarPreviewContext('CalendarPreview.Reset');

  /* No `defaultDate` means the part has no job at all, which is a different
     thing from having nothing to restore right now — `null` is a default. */
  if (defaultDate === undefined) return null;

  const sameDay = (a: Date, b: Date) =>
    dayKey(a, timeZone) === dayKey(b, timeZone);

  /* A period matches on scale too: the same day at two scales is two values. */
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

  /* `restored` takes `aria-disabled`, not `disabled`: the button disables
     itself the moment it is activated, and a disabled element cannot hold
     focus — so a keyboard reset dropped the user on `<body>` in the middle of
     the calendar, which is the thing staying mounted was meant to avoid.
     Inertness that comes from outside is a real `disabled`; nothing moves
     focus onto the button at that point. */
  const inert = disabled || readOnly || disabledProp;

  return (
    <IconButton
      size={3}
      className={cx(styles['nav-button'], styles.reset, className)}
      disabled={inert}
      aria-disabled={restored || undefined}
      data-slot='calendar-preview-reset'
      data-restored={restored || undefined}
      aria-label='Reset'
      onClick={event => {
        onClick?.(event);
        /* `aria-disabled` is a claim, not a guard — the press still arrives. */
        if (restored) return;
        reset();
      }}
      {...props}
    >
      {children ?? <UndoIcon />}
    </IconButton>
  );
}

CalendarPreviewReset.displayName = 'CalendarPreview.Reset';
