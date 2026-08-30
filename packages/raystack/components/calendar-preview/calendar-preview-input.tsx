'use client';

import { cx } from 'class-variance-authority';
import { useRef, useState } from 'react';
import { Input, type InputProps } from '../input/input';
import styles from './calendar-preview.module.css';
import type { CalendarValidity } from './calendar-preview-context';
import { useCalendarPreviewContext } from './calendar-preview-context';
import {
  dayKey,
  formatForGranularity,
  isWithinBounds,
  parseForGranularity,
  patternForGranularity
} from './date-adapter';

export interface CalendarPreviewInputProps
  extends Omit<InputProps, 'value' | 'onChange' | 'defaultValue'> {}

/**
 * The typed single-date field. Owns parse and format; renders no error UI of
 * its own, reporting to the root through `onValidityChange` so a surrounding
 * `Field` can present it.
 */
export function CalendarPreviewInput({
  className,
  ...props
}: CalendarPreviewInputProps) {
  const {
    selection,
    granularity,
    value,
    setValue,
    setMonth,
    reportValidity,
    minDate,
    maxDate,
    isDateUnavailable,
    format,
    timeZone,
    disabled,
    readOnly
  } = useCalendarPreviewContext<Date | null>('Input');

  const committed = value
    ? formatForGranularity(value, granularity, format, timeZone)
    : '';
  const committedKey = value ? dayKey(value, timeZone) : '';

  /** `null` means "not editing — show the committed value". */
  const [draft, setDraft] = useState<string | null>(null);

  /*
   * Drop the draft once the committed value moves underneath it — a grid
   * click, a preset, or a controlled parent writing back. Adjusted during
   * render rather than in an effect, the way `tour-root.tsx` does, and keyed
   * on `dayKey` because a format without a year renders the same text for two
   * different years.
   */
  const lastCommitted = useRef(committedKey);
  if (lastCommitted.current !== committedKey) {
    lastCommitted.current = committedKey;
    if (draft !== null) setDraft(null);
  }

  if (selection !== 'single') {
    throw new Error(
      'CalendarPreview.Input requires the default selection="single" — use CalendarPreview.RangeInput for ranges'
    );
  }

  const validate = (date: Date): CalendarValidity => {
    if (!isWithinBounds(date, minDate, maxDate)) {
      return { valid: false, reason: 'out-of-bounds' };
    }
    if (isDateUnavailable?.(date)) {
      return { valid: false, reason: 'unavailable' };
    }
    return { valid: true };
  };

  const commit = (text: string) => {
    // An emptied field clears the value; that is not an error state.
    if (text.trim() === '') {
      reportValidity({ valid: true });
      setValue(null);
      return;
    }

    const parsed = parseForGranularity(text, granularity, format, timeZone);
    if (!parsed) {
      reportValidity({ valid: false, reason: 'unparseable' });
      return;
    }

    const validity = validate(parsed);
    reportValidity(validity);
    if (!validity.valid) return;

    setValue(parsed);
    // Typing navigates the grid, so the committed day is actually visible.
    setMonth(parsed);
  };

  return (
    <div
      className={cx(styles.field, className)}
      data-slot='calendar-preview-input'
    >
      <Input
        value={draft ?? committed}
        placeholder={patternForGranularity(granularity, format)}
        disabled={disabled}
        readOnly={readOnly}
        onChange={event => setDraft(event.target.value)}
        onBlur={() => {
          if (draft === null) return;
          commit(draft);
          setDraft(null);
        }}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            event.preventDefault();
            if (draft === null) return;
            commit(draft);
            setDraft(null);
          }
          if (event.key === 'Escape') setDraft(null);
        }}
        {...props}
      />
    </div>
  );
}

CalendarPreviewInput.displayName = 'CalendarPreview.Input';
