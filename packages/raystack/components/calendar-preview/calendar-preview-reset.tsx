'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { Button } from '../button';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { dayKey } from './date-adapter';

export type CalendarPreviewResetProps = ComponentProps<typeof Button>;

/**
 * Restores `defaultDate`.
 *
 * A **value** reset, not a view reset: it commits the default day and leaves
 * the visible month where the user left it.
 *
 * Renders only when there is something to restore — `defaultDate` is set and
 * the current value differs from it. `defaultDate` is a separate prop from
 * `defaultValue` precisely so this works under a controlled `value`, which
 * `useControlled` ignores `defaultValue` for.
 */
export function CalendarPreviewReset({
  className,
  children,
  onClick,
  ...props
}: CalendarPreviewResetProps) {
  const { value, defaultDate, reset, disabled, readOnly, timeZone } =
    useCalendarPreviewContext('CalendarPreview.Reset');

  if (!defaultDate) return null;
  if (value && dayKey(value, timeZone) === dayKey(defaultDate, timeZone)) {
    return null;
  }

  return (
    <Button
      variant='text'
      size='small'
      color='neutral'
      className={cx(styles.reset, className)}
      disabled={disabled || readOnly}
      data-slot='calendar-preview-reset'
      onClick={event => {
        onClick?.(event);
        reset();
      }}
      {...props}
    >
      {children ?? 'Reset'}
    </Button>
  );
}

CalendarPreviewReset.displayName = 'CalendarPreview.Reset';
