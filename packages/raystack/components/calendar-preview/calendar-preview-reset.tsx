'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { UndoIcon } from '~/icons';
import { IconButton } from '../icon-button';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { dayKey } from './date-adapter';

export type CalendarPreviewResetProps = ComponentProps<typeof IconButton>;

/**
 * Restores `defaultDate`. A value reset, not a view reset — it leaves the
 * visible month alone, and renders only when the value differs from the
 * default. Keyed off `defaultDate` rather than `defaultValue` so it still
 * shows under a controlled `value`.
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
    <IconButton
      size={3}
      className={cx(styles['nav-button'], styles.reset, className)}
      disabled={disabled || readOnly}
      data-slot='calendar-preview-reset'
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
