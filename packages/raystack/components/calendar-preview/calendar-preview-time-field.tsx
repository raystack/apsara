'use client';

import { cx } from 'class-variance-authority';
import { type ComponentProps, useRef, useState } from 'react';
import { Input } from '../input/input';
import styles from './calendar-preview.module.css';
import type {
  CalendarValidity,
  DateRangeValue
} from './calendar-preview-context';
import { useCalendarPreviewContext } from './calendar-preview-context';
import {
  getHours,
  getMinutes,
  isWithinTimeBounds,
  pad,
  setTime
} from './date-adapter';

export interface CalendarPreviewTimeFieldProps
  extends Omit<ComponentProps<'div'>, 'children'> {
  /**
   * Minute increment the field snaps to.
   * @defaultValue 1
   */
  step?: number;
  /**
   * 24-hour fields, or 12-hour with an AM/PM control.
   * @defaultValue 24
   */
  hourCycle?: 12 | 24;
}

/**
 * Hour and minute for the selected date, plus AM/PM under a 12-hour cycle.
 *
 * It edits the time of an existing selection rather than creating one: with
 * nothing selected there is no day to attach a time to, and inventing "today"
 * would be a silent decision. The fields are empty and disabled until a date
 * exists.
 */
export function CalendarPreviewTimeField({
  className,
  step: stepProp = 1,
  hourCycle = 24,
  ...props
}: CalendarPreviewTimeFieldProps) {
  /*
   * Clamped at the boundary. `step` is public and unvalidated: `step={0}` sent
   * `Math.round(parsed / 0) * 0` to NaN, `Math.min(59, NaN)` to NaN, and
   * `.minute(NaN)` produced an Invalid Date that was committed and rendered as
   * the literal string `NaN`. A fractional step rounded to a fractional minute.
   */
  const step = Math.max(1, Math.floor(stepProp) || 1);
  const {
    selection,
    value,
    setValue,
    activeField,
    lock,
    timeZone,
    disabled,
    readOnly,
    minDate,
    maxDate,
    isDateUnavailable,
    reportValidity
  } = useCalendarPreviewContext('TimeField');

  const [draft, setDraft] = useState<{
    hour: string | null;
    minute: string | null;
  }>({ hour: null, minute: null });

  const target = targetDate(selection, value, lock, activeField);
  const lastTarget = useRef(target?.getTime() ?? null);
  if (lastTarget.current !== (target?.getTime() ?? null)) {
    lastTarget.current = target?.getTime() ?? null;
    if (draft.hour !== null || draft.minute !== null) {
      setDraft({ hour: null, minute: null });
    }
  }

  const editable = !!target && !disabled && !readOnly;
  const hours24 = target ? getHours(target, timeZone) : 0;
  const minutes = target ? getMinutes(target, timeZone) : 0;
  const isPm = hours24 >= 12;

  const displayHour = hourCycle === 12 ? hours24 % 12 || 12 : hours24;

  /*
   * The same shape `.Input` and `.RangeInput` validate through, but through
   * bounds that respect a time of day: this is the one writer whose whole job
   * is the time inside the day, so a plain day comparison would wave through
   * 23:00 under a `maxDate` of 10:00. Without this the picker had one writer
   * that ignored its own bounds and one callback that never fired for it.
   */
  const validate = (
    date: Date,
    nextRange: DateRangeValue | null
  ): CalendarValidity => {
    if (!isWithinTimeBounds(date, minDate, maxDate, timeZone)) {
      return { valid: false, reason: 'out-of-bounds' };
    }
    if (isDateUnavailable?.(date)) {
      return { valid: false, reason: 'unavailable' };
    }
    /*
     * By instant, not by day. `.RangeInput` guards ordering with `isAfterDay`
     * because it commits whole typed dates; both endpoints of a range can sit
     * on one day, and moving a time past the other end inverts the range
     * without any day changing — which no day comparison can see.
     *
     * Refused rather than repaired. `.RangeInput` clears the opposite
     * endpoint, which is right when the user has typed a whole date over a
     * field, but here they nudged an hour: deleting the other end of their
     * range in response would throw away far more than they touched, and
     * swapping would move a value into a field they were not editing.
     */
    if (
      nextRange?.from &&
      nextRange.to &&
      nextRange.from.getTime() > nextRange.to.getTime()
    ) {
      return { valid: false, reason: 'range-order' };
    }
    return { valid: true };
  };

  const write = (nextHour24: number, nextMinute: number) => {
    if (!target || !editable) return;
    const updated = setTime(target, nextHour24, nextMinute, timeZone);

    const field = lock ? (lock === 'from' ? 'to' : 'from') : activeField;
    const nextRange =
      selection === 'range'
        ? {
            ...((value as DateRangeValue | null) ?? { from: null, to: null }),
            [field]: updated
          }
        : null;

    const validity = validate(updated, nextRange);
    reportValidity(validity);
    // The draft is cleared by the caller either way, so a rejected edit snaps
    // the field back to the committed time rather than leaving it stranded.
    if (!validity.valid) return;

    if (nextRange) {
      setValue(nextRange);
      return;
    }
    if (selection === 'multiple') {
      const current = (value as Date[]) ?? [];
      setValue(
        current.map(item =>
          item.getTime() === target.getTime() ? updated : item
        )
      );
      return;
    }
    setValue(updated);
  };

  const commitHour = (text: string) => {
    const parsed = Number.parseInt(text, 10);
    /*
     * Reported, not swallowed. Both rejections used to return in silence — no
     * validity, no value change, the text just snapping back — so a consumer
     * wiring `onValidityChange` was told nothing about `abc` or `99`, while the
     * file's own comment claimed it validated the shape the typed fields do.
     */
    if (Number.isNaN(parsed)) {
      reportValidity({ valid: false, reason: 'unparseable' });
      return;
    }
    const max = hourCycle === 12 ? 12 : 23;
    const min = hourCycle === 12 ? 1 : 0;
    if (parsed < min || parsed > max) {
      reportValidity({ valid: false, reason: 'out-of-bounds' });
      return;
    }
    const next24 = hourCycle === 12 ? (parsed % 12) + (isPm ? 12 : 0) : parsed;
    write(next24, minutes);
  };

  const commitMinute = (text: string) => {
    const parsed = Number.parseInt(text, 10);
    if (Number.isNaN(parsed)) {
      reportValidity({ valid: false, reason: 'unparseable' });
      return;
    }
    if (parsed < 0 || parsed > 59) {
      reportValidity({ valid: false, reason: 'out-of-bounds' });
      return;
    }
    /*
     * Snapped down to the grid, not clamped to 59. An unclamped round sends 59
     * with step 15 to 60, and dayjs's `.minute(60)` rolls into the next hour —
     * but clamping produced 59, a value off the field's own step grid, which is
     * the one thing `step` promises not to emit. The last multiple that fits in
     * the hour is 45.
     */
    const snapped = Math.round(parsed / step) * step;
    write(hours24, snapped > 59 ? Math.floor(59 / step) * step : snapped);
  };

  const field = (
    part: 'hour' | 'minute',
    display: string,
    commit: (text: string) => void
  ) => (
    <Input
      size='small'
      className={styles.timeInput}
      inputMode='numeric'
      value={draft[part] ?? display}
      disabled={disabled || !target}
      readOnly={readOnly}
      aria-label={part === 'hour' ? 'Hour' : 'Minute'}
      onChange={event =>
        setDraft(current => ({ ...current, [part]: event.target.value }))
      }
      onBlur={() => {
        if (draft[part] === null) return;
        commit(draft[part] as string);
        setDraft(current => ({ ...current, [part]: null }));
      }}
      onKeyDown={event => {
        if (event.key === 'Enter') {
          // Nothing typed, so Enter belongs to the form — as in the typed
          // fields, where preventing it unconditionally blocked implicit
          // submit for the life of an untouched field.
          if (draft[part] === null) return;
          event.preventDefault();
          commit(draft[part] as string);
          setDraft(current => ({ ...current, [part]: null }));
        }
        /*
         * Two-stage, as `.Input` and `.RangeInput` are: the first press
         * reverts the digits, a second dismisses the popover. Without the
         * stop, correcting a mistyped hour cost you the calendar — the exact
         * cost the shared contract was written to avoid.
         */
        if (event.key === 'Escape' && draft[part] !== null) {
          event.stopPropagation();
          setDraft(current => ({ ...current, [part]: null }));
        }
      }}
    />
  );

  return (
    <div
      className={cx(styles.timeField, className)}
      data-slot='calendar-preview-time-field'
      {...props}
    >
      {field('hour', target ? pad(displayHour) : '', commitHour)}
      <span className={styles.timeSeparator} aria-hidden='true'>
        :
      </span>
      {field('minute', target ? pad(minutes) : '', commitMinute)}
      {hourCycle === 12 && (
        <div className={styles.meridiem} data-slot='calendar-preview-meridiem'>
          {(['AM', 'PM'] as const).map(label => {
            const pressed = label === (isPm ? 'PM' : 'AM');
            return (
              <button
                key={label}
                type='button'
                className={styles.meridiemButton}
                disabled={!editable}
                aria-pressed={pressed}
                data-selected={pressed || undefined}
                onClick={() =>
                  write(
                    label === 'PM' ? (hours24 % 12) + 12 : hours24 % 12,
                    minutes
                  )
                }
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

CalendarPreviewTimeField.displayName = 'CalendarPreview.TimeField';

/** The date whose time this field edits, per selection mode. */
function targetDate(
  selection: string,
  value: unknown,
  lock: 'from' | 'to' | undefined,
  activeField: 'from' | 'to'
): Date | null {
  if (selection === 'range') {
    const range = value as DateRangeValue | null;
    if (!range) return null;
    const field = lock ? (lock === 'from' ? 'to' : 'from') : activeField;
    return range[field] ?? null;
  }
  if (selection === 'multiple') {
    const list = (value as Date[]) ?? [];
    return list[list.length - 1] ?? null;
  }
  return (value as Date | null) ?? null;
}
