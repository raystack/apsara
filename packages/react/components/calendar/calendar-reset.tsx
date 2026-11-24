'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { UndoIcon } from '~/icons';
import { IconButton } from '../icon-button';
import styles from './calendar.module.css';
import { useCalendarContext } from './calendar-context';
import { isRange, isScaleValue } from './calendar-root';
import { dayKey } from './date-adapter';

export type CalendarResetProps = ComponentProps<typeof IconButton>;

/* Unmounting would send focus to `<body>` and drop the nav's `flex: none` child. */
export function CalendarReset({
  className,
  children,
  onClick,
  disabled: disabledProp,
  ...props
}: CalendarResetProps) {
  const { value, defaultDate, reset, disabled, readOnly, timeZone } =
    useCalendarContext('Calendar.Reset');

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

  /* `aria-disabled`, not `disabled`: a disabled element cannot hold the focus it was activated with. */
  const inert = disabled || readOnly || disabledProp;

  return (
    <IconButton
      size={3}
      className={cx(styles['nav-button'], styles.reset, className)}
      disabled={inert}
      aria-disabled={restored || undefined}
      data-slot='calendar-reset'
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

CalendarReset.displayName = 'Calendar.Reset';
