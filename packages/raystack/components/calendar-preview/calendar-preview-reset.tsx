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
 * Restores `defaultDate`.
 *
 * A **value** reset, not a view reset: it commits the default day and leaves
 * the visible month where the user left it.
 *
 * Renders only when there is something to restore — `defaultDate` is set and
 * the current value differs from it. `defaultDate` is a separate prop from
 * `defaultValue` precisely so this works under a controlled `value`, which
 * `useControlled` ignores `defaultValue` for.
 *
 * Drawn as the undo glyph and grouped with the two nav buttons, which is where
 * the single-month header in reference A puts it. The two-month header has no
 * reset at all — see `.Header`.
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
