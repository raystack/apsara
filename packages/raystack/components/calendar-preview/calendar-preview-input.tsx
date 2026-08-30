'use client';

import { mergeProps } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type ChangeEvent, type KeyboardEvent, useRef, useState } from 'react';
import { Input, type InputProps } from '../input/input';
import styles from './calendar-preview.module.css';
import type { CalendarValidity } from './calendar-preview-context';
import { useCalendarPreviewContext } from './calendar-preview-context';
import {
  dayKey,
  formatForGranularity,
  getYear,
  isWithinBounds,
  parseAcrossGranularities,
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
    granularities,
    setGranularity,
    month,
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

    /*
     * The active granularity wins. Only when it cannot read the text do we
     * scan the granularities on offer, so typing `Q4` in a day field switches
     * to Quarter rather than failing — and a day-only picker still rejects it.
     */
    const visibleYear = getYear(month, timeZone);
    let parsed = parseForGranularity(
      text,
      granularity,
      format,
      timeZone,
      visibleYear
    );
    let matched = granularity;
    if (!parsed) {
      const across = parseAcrossGranularities(
        text,
        granularities,
        format,
        timeZone,
        visibleYear
      );
      if (across) {
        parsed = across.date;
        matched = across.granularity as typeof granularity;
      }
    }
    if (!parsed) {
      reportValidity({ valid: false, reason: 'unparseable' });
      return;
    }

    const validity = validate(parsed);
    reportValidity(validity);
    if (!validity.valid) return;

    if (matched !== granularity) setGranularity(matched);
    setValue(parsed, { granularity: matched });
    // Typing navigates the grid, so the committed day is actually visible.
    setMonth(parsed);
  };

  return (
    <div
      className={cx(styles.field, className)}
      data-slot='calendar-preview-input'
    >
      {/*
       * Merged, not just spread-last. Spread-last alone lets a consumer
       * `onChange`/`onBlur`/`onKeyDown` *replace* parse-and-commit, leaving a
       * field that accepts text and reports nothing — RFC problem 9 in a new
       * shape. `.Preset` already merges; these now do too.
       */}
      <Input
        {...(mergeProps<'input'>(
          {
            value: draft ?? committed,
            placeholder: patternForGranularity(granularity, format),
            disabled,
            readOnly,
            onChange: (event: ChangeEvent<HTMLInputElement>) =>
              setDraft(event.target.value),
            onBlur: () => {
              if (draft === null) return;
              commit(draft);
              setDraft(null);
            },
            onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                if (draft === null) return;
                commit(draft);
                setDraft(null);
              }
              if (event.key === 'Escape') setDraft(null);
            }
          } as never,
          props as never
        ) as InputProps)}
      />
    </div>
  );
}

CalendarPreviewInput.displayName = 'CalendarPreview.Input';
