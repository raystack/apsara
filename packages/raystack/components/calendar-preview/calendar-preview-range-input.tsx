'use client';

import { mergeProps } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState
} from 'react';
import { Input, type InputProps } from '../input/input';
import styles from './calendar-preview.module.css';
import type {
  CalendarRangeField,
  CalendarValidity,
  DateRangeValue
} from './calendar-preview-context';
import {
  useCalendarPreviewContext,
  useInsideTrigger
} from './calendar-preview-context';
import {
  dayKey,
  endOfDay,
  formatForGranularity,
  getHours,
  getMinutes,
  getYear,
  isAfterDay,
  isWithinBounds,
  parseAcrossGranularities,
  parseForGranularity,
  patternForGranularity,
  setTime,
  startOfDay
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
    granularities,
    setGranularity,
    month,
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
    readOnly,
    setOpen,
    registerTriggerField
  } = useCalendarPreviewContext<DateRangeValue | null>('RangeInput');

  /*
   * Both fields count as one registration — the root counts registrations, and
   * one is enough to say the trigger owns focus. See `.Input` for what the
   * flag changes.
   */
  const insideTrigger = useInsideTrigger();
  useEffect(() => {
    if (!insideTrigger) return;
    return registerTriggerField();
  }, [insideTrigger, registerTriggerField]);

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
    if (!isWithinBounds(date, minDate, maxDate, timeZone)) {
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
      return false;
    }

    const validity = validate(parsed);
    reportValidity(validity);
    if (!validity.valid) return false;

    if (matched !== granularity) setGranularity(matched);

    /*
     * A typed day carries no time, so it inherits the one this endpoint already
     * had — otherwise every retype silently discarded whatever `.TimeField` or
     * a preset had put there, resetting it to midnight.
     *
     * Day granularity only. Every other granularity resolves to the first
     * instant of a period, and `Q4 2024` means the quarter, not 09:30 on the
     * day it happens to start.
     */
    const previous = matched === 'day' ? range[field] : null;
    const committed = previous
      ? setTime(
          parsed,
          getHours(previous, timeZone),
          getMinutes(previous, timeZone),
          timeZone
        )
      : parsed;

    const next: DateRangeValue = { ...range, [field]: committed };

    /*
     * A typed start after the existing end clears the end rather than
     * swapping the two: swapping silently moves a value into a field the user
     * did not type in, which reads as the component losing their input.
     *
     * By day, deliberately. An instant comparison here would delete the user's
     * start the moment they typed an end on the same day, because a bare date
     * is midnight and `.TimeField` had already put 08:00 on the start.
     */
    if (next.from && next.to && isAfterDay(next.from, next.to, timeZone)) {
      if (field === 'from') next.to = null;
      else next.from = null;
    } else if (
      next.from &&
      next.to &&
      next.from.getTime() > next.to.getTime()
    ) {
      /*
       * Ordered by day but inverted by instant — the case a day comparison
       * cannot see, and the one `.TimeField` refuses outright. Here the
       * inversion is an artefact of the missing time rather than something the
       * user asked for, so it is resolved instead of refused: a bare end date
       * reads as "through the end of that day", which is how every other part
       * of this component reads a midnight bound.
       */
      if (field === 'to') {
        next.to = endOfDay(next.to, timeZone);
      } else {
        next.from = startOfDay(next.from, timeZone);
      }
    }

    setValue(next, { granularity: matched });
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
      {/*
       * Merged, not just spread-last: a consumer `onBlur`/`onKeyDown` would
       * otherwise replace parse-and-commit outright, leaving a field that
       * accepts text and reports nothing.
       */}
      <Input
        {...(mergeProps<'input'>(
          {
            ref: field === 'to' ? endRef : undefined,
            value: draft[field] ?? committedText,
            placeholder: patternForGranularity(granularity, format),
            disabled,
            readOnly: readOnly || lock === field,
            'aria-label': field === 'from' ? 'Start date' : 'End date',
            onFocus: () => setActiveField(field),
            onChange: (event: ChangeEvent<HTMLInputElement>) =>
              setDraft(current => ({
                ...current,
                [field]: event.target.value
              })),
            onBlur: () => {
              if (draft[field] === null) return;
              commit(field, draft[field] as string);
              setDraft(current => ({ ...current, [field]: null }));
            },
            onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                const pending = draft[field];
                if (pending === null) return;
                const committedOk = commit(field, pending);
                setDraft(current => ({ ...current, [field]: null }));
                if (committedOk && field === 'from' && lock !== 'to') {
                  endRef.current?.focus();
                }
              }
              // See `.Input`: ArrowDown is the keyboard's way into a calendar
              // whose trigger carries no tab stop.
              if (event.key === 'ArrowDown' && insideTrigger) {
                event.preventDefault();
                setOpen(true);
              }
              // Two-stage, as a combobox is: revert the text first, dismiss on
              // the second press.
              if (event.key === 'Escape' && draft[field] !== null) {
                event.stopPropagation();
                setDraft(current => ({ ...current, [field]: null }));
              }
            }
          } as never,
          (props ?? {}) as never
        ) as InputProps)}
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
