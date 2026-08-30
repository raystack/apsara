'use client';

import { cx } from 'class-variance-authority';
import { useRef, useState } from 'react';
import { Input, type InputProps } from '../input/input';
import styles from './calendar-preview.module.css';
import type {
  CalendarRangeField,
  CalendarValidity,
  DateRangeValue
} from './calendar-preview-context';
import { useCalendarPreviewContext } from './calendar-preview-context';
import {
  dayKey,
  formatForGranularity,
  isWithinBounds,
  parseForGranularity,
  patternForGranularity
} from './date-adapter';

type FieldInputProps = Omit<InputProps, 'value' | 'onChange' | 'defaultValue'>;

export interface CalendarPreviewRangeInputProps {
  /** Props for the start field. */
  startProps?: FieldInputProps;
  /** Props for the end field. */
  endProps?: FieldInputProps;
  className?: string;
}

const EMPTY_RANGE: DateRangeValue = { from: null, to: null };

/**
 * Paired start/end fields. Both are typable — the old `RangePicker` left them
 * `readOnly`, which made it asymmetric with `DatePicker` for no stated reason.
 *
 * Renders no error UI of its own; validity goes to the root through
 * `onValidityChange` so a surrounding `Field` can present it.
 */
export function CalendarPreviewRangeInput({
  startProps,
  endProps,
  className
}: CalendarPreviewRangeInputProps) {
  const {
    selection,
    granularity,
    value,
    setValue,
    setMonth,
    activeField,
    setActiveField,
    lock,
    reportValidity,
    minDate,
    maxDate,
    isDateUnavailable,
    format,
    timeZone,
    disabled,
    readOnly
  } = useCalendarPreviewContext<DateRangeValue | null>('RangeInput');

  const range = value ?? EMPTY_RANGE;

  const committedFrom = range.from
    ? formatForGranularity(range.from, granularity, format, timeZone)
    : '';
  const committedTo = range.to
    ? formatForGranularity(range.to, granularity, format, timeZone)
    : '';

  /*
   * Draft text per field, so a half-typed date survives a re-render. `null`
   * means "not editing — show the committed value".
   */
  const [draft, setDraft] = useState<Record<CalendarRangeField, string | null>>(
    { from: null, to: null }
  );

  const endRef = useRef<HTMLInputElement>(null);

  /*
   * Drop drafts once the committed value moves underneath them — a grid
   * click, a preset, or a controlled parent writing back.
   *
   * Adjusted during render rather than in an effect (the pattern
   * `tour-root.tsx` uses): the draft is derived from the committed value, so
   * an effect would render one frame of stale text first, and its dependency
   * array would be a change-trigger rather than a real dependency. Comparing
   * formatted strings means a fresh `Date` identity for the same day is a
   * no-op, which is what the old family needed lint suppressions for.
   */
  const committedKey = {
    from: range.from ? dayKey(range.from, timeZone) : '',
    to: range.to ? dayKey(range.to, timeZone) : ''
  };
  const lastCommitted = useRef(committedKey);
  if (
    lastCommitted.current.from !== committedKey.from ||
    lastCommitted.current.to !== committedKey.to
  ) {
    lastCommitted.current = committedKey;
    if (draft.from !== null || draft.to !== null) {
      setDraft({ from: null, to: null });
    }
  }

  // Every hook has run by this point, so throwing here is safe.
  if (selection !== 'range') {
    throw new Error(
      'CalendarPreview.RangeInput requires selection="range" on <CalendarPreview>'
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

  const commit = (field: CalendarRangeField, text: string) => {
    /*
     * An emptied field clears that endpoint, and is not an error. The old
     * DatePicker reported empty as invalid, which left no way to clear.
     */
    if (text.trim() === '') {
      reportValidity({ valid: true });
      setValue({ ...range, [field]: null });
      return true;
    }

    const parsed = parseForGranularity(text, granularity, format, timeZone);
    if (!parsed) {
      reportValidity({ valid: false, reason: 'unparseable' });
      return false;
    }

    const validity = validate(parsed);
    reportValidity(validity);
    if (!validity.valid) return false;

    const next: DateRangeValue = { ...range, [field]: parsed };
    /*
     * A typed start after the existing end clears the end rather than
     * swapping the two: swapping silently moves a value into a field the user
     * did not type in, which reads as the component losing their input.
     */
    if (next.from && next.to && next.from > next.to) {
      if (field === 'from') next.to = null;
      else next.from = null;
    }

    setValue(next);
    // Typing navigates the grid, so the committed day is actually visible.
    setMonth(parsed);
    return true;
  };

  const renderField = (
    field: CalendarRangeField,
    committedText: string,
    props?: FieldInputProps
  ) => (
    /*
     * The slot and the active flag go on a wrapper, not on `Input`. `Input`
     * spreads `...props` last, so a `data-slot` passed to it would overwrite
     * its own `data-slot="input"` — a semver-covered name on another
     * component. The wrapper also gives the active style something with a
     * border to colour, since `Input`'s border sits on its container.
     */
    <div
      key={field}
      className={styles.rangeField}
      data-slot={
        field === 'from'
          ? 'calendar-preview-input-start'
          : 'calendar-preview-input-end'
      }
      data-active={activeField === field || undefined}
    >
      <Input
        ref={field === 'to' ? endRef : undefined}
        value={draft[field] ?? committedText}
        placeholder={patternForGranularity(granularity, format)}
        disabled={disabled}
        readOnly={readOnly || lock === field}
        aria-label={field === 'from' ? 'Start date' : 'End date'}
        onFocus={() => setActiveField(field)}
        onChange={event =>
          setDraft(current => ({ ...current, [field]: event.target.value }))
        }
        onBlur={() => {
          if (draft[field] === null) return;
          commit(field, draft[field] as string);
          setDraft(current => ({ ...current, [field]: null }));
        }}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            event.preventDefault();
            const pending = draft[field];
            if (pending === null) return;
            const committedOk = commit(field, pending);
            setDraft(current => ({ ...current, [field]: null }));
            /*
             * Advance only on an explicit Enter, never mid-typing — moving
             * focus while someone is still editing is worse than one extra tab.
             */
            if (committedOk && field === 'from' && lock !== 'to') {
              endRef.current?.focus();
            }
          }
          if (event.key === 'Escape') {
            setDraft(current => ({ ...current, [field]: null }));
          }
        }}
        {...props}
      />
    </div>
  );

  return (
    <div
      className={cx(styles.rangeInputs, className)}
      data-slot='calendar-preview-range-inputs'
    >
      {renderField('from', committedFrom, startProps)}
      <span className={styles.rangeSeparator} aria-hidden='true'>
        –
      </span>
      {renderField('to', committedTo, endProps)}
    </div>
  );
}

CalendarPreviewRangeInput.displayName = 'CalendarPreview.RangeInput';
