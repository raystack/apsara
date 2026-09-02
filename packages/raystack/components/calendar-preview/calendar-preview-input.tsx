'use client';

import { mergeProps } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { useEffect, useRef, useState } from 'react';
import { Input, type InputProps } from '../input/input';
import styles from './calendar-preview.module.css';
import type { CalendarValidity } from './calendar-preview-context';
import {
  useCalendarPreviewContext,
  useInsideTrigger
} from './calendar-preview-context';
import {
  parseTypedText,
  typedFieldHandlers
} from './calendar-preview-typed-field';
import {
  dayKey,
  formatForGranularity,
  isWithinBounds,
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
    readOnly,
    setOpen,
    registerTriggerField
  } = useCalendarPreviewContext<Date | null>('Input');

  /*
   * Tell the root that the typed field is inside `.Trigger`, which is what
   * lets the trigger drop its button role and `.Content` decline the focus it
   * would otherwise steal from this field. Nothing happens when the field is
   * composed inside `.Content` instead, where neither adjustment applies.
   */
  const insideTrigger = useInsideTrigger();
  useEffect(() => {
    if (!insideTrigger) return;
    return registerTriggerField();
  }, [insideTrigger, registerTriggerField]);

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
    if (!isWithinBounds(date, minDate, maxDate, timeZone)) {
      return { valid: false, reason: 'out-of-bounds' };
    }
    if (isDateUnavailable?.(date)) {
      return { valid: false, reason: 'unavailable' };
    }
    return { valid: true };
  };

  const commit = (text: string): boolean => {
    // An emptied field clears the value; that is not an error state.
    if (text.trim() === '') {
      reportValidity({ valid: true });
      setValue(null);
      return true;
    }

    const read = parseTypedText(text, {
      granularity,
      granularities,
      format,
      timeZone,
      month
    });
    if (!read) {
      reportValidity({ valid: false, reason: 'unparseable' });
      return false;
    }

    const validity = validate(read.date);
    reportValidity(validity);
    if (!validity.valid) return false;

    if (read.granularity !== granularity) setGranularity(read.granularity);
    setValue(read.date, { granularity: read.granularity });
    // Typing navigates the grid, so the committed day is actually visible.
    setMonth(read.date);
    return true;
  };

  const handlers = typedFieldHandlers({
    draft,
    setDraft,
    commit,
    insideTrigger,
    setOpen
  });

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
            ...handlers
          } as never,
          props as never
        ) as InputProps)}
      />
    </div>
  );
}

CalendarPreviewInput.displayName = 'CalendarPreview.Input';
