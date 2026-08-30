'use client';

import { cx } from 'class-variance-authority';
import { type ComponentProps, useRef, useState } from 'react';
import { Input } from '../input/input';
import styles from './calendar-preview.module.css';
import type { DateRangeValue } from './calendar-preview-context';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { getHours, getMinutes, setTime } from './date-adapter';

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

const pad = (value: number) => String(value).padStart(2, '0');

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
  step = 1,
  hourCycle = 24,
  ...props
}: CalendarPreviewTimeFieldProps) {
  const {
    selection,
    value,
    setValue,
    activeField,
    lock,
    timeZone,
    disabled,
    readOnly
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

  const write = (nextHour24: number, nextMinute: number) => {
    if (!target || !editable) return;
    const updated = setTime(target, nextHour24, nextMinute, timeZone);
    if (selection === 'range') {
      const range = (value as DateRangeValue | null) ?? {
        from: null,
        to: null
      };
      const field = lock ? (lock === 'from' ? 'to' : 'from') : activeField;
      setValue({ ...range, [field]: updated });
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
    if (Number.isNaN(parsed)) return;
    const max = hourCycle === 12 ? 12 : 23;
    const min = hourCycle === 12 ? 1 : 0;
    if (parsed < min || parsed > max) return;
    const next24 = hourCycle === 12 ? (parsed % 12) + (isPm ? 12 : 0) : parsed;
    write(next24, minutes);
  };

  const commitMinute = (text: string) => {
    const parsed = Number.parseInt(text, 10);
    if (Number.isNaN(parsed) || parsed < 0 || parsed > 59) return;
    /*
     * Clamped: an unclamped round sends 59 with step 15 to 60, and dayjs's
     * `.minute(60)` rolls into the next hour — so validation rejected >59 two
     * lines above and the snap then produced one anyway.
     */
    write(hours24, Math.min(59, Math.round(parsed / step) * step));
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
          event.preventDefault();
          if (draft[part] === null) return;
          commit(draft[part] as string);
          setDraft(current => ({ ...current, [part]: null }));
        }
        if (event.key === 'Escape') {
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
