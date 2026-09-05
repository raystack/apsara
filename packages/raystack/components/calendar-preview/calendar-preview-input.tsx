import { cx } from 'class-variance-authority';
import { type ComponentProps, useRef, useState } from 'react';
import { CalendarIcon } from '~/icons';
import { Input } from '../input';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { dayKey, parseKey } from './date-adapter';
import { parseScaleInput } from './lib/parse';

export type CalendarPreviewInputValidity = {
  valid: boolean;
  reason?: 'unparseable' | 'out-of-bounds' | 'unavailable';
};

export interface CalendarPreviewInputProps
  extends Omit<ComponentProps<typeof Input>, 'value' | 'defaultValue'> {
  /** Called when the typed text starts or stops being a usable date. */
  onValidityChange?: (validity: CalendarPreviewInputValidity) => void;
}

const VALID: CalendarPreviewInputValidity = { valid: true };

/**
 * The typed date field.
 *
 * It never touches open state — `.Trigger` owns that. Typing sets a draft and
 * emits nothing; Enter and blur commit, and Base UI's outside press closes the
 * popover, which blurs and therefore commits too.
 */
export function CalendarPreviewInput({
  placeholder = 'Select date',
  trailingIcon = <CalendarIcon />,
  onValidityChange,
  onKeyDown,
  onBlur,
  className,
  readOnly: readOnlyProp,
  ...props
}: CalendarPreviewInputProps) {
  const {
    value,
    setValue,
    formatValue,
    scale,
    isDateUnavailable,
    minDate,
    maxDate,
    timeZone,
    clearable,
    today,
    disabled,
    readOnly
  } = useCalendarPreviewContext('CalendarPreview.Input');

  /* Null means "show the committed value"; a string is the user's draft. */
  const [draft, setDraft] = useState<string | null>(null);
  const lastReported = useRef<CalendarPreviewInputValidity>(VALID);

  const report = (next: CalendarPreviewInputValidity) => {
    if (
      next.valid === lastReported.current.valid &&
      next.reason === lastReported.current.reason
    ) {
      return;
    }
    lastReported.current = next;
    onValidityChange?.(next);
  };

  const resolve = (text: string): CalendarPreviewInputValidity | Date => {
    const parsed = parseScaleInput(text);
    /* Coarser scales parse today but have nowhere to go until the scale
       switcher lands, so they read as unparseable rather than committing a day
       the user did not type. */
    if (!parsed || parsed.scale !== 'day') {
      return { valid: false, reason: 'unparseable' };
    }
    const date = parseKey(parsed.date);
    const key = dayKey(date, timeZone);
    if (
      (minDate && key < dayKey(minDate, timeZone)) ||
      (maxDate && key > dayKey(maxDate, timeZone))
    ) {
      return { valid: false, reason: 'out-of-bounds' };
    }
    if (isDateUnavailable(date)) return { valid: false, reason: 'unavailable' };
    return date;
  };

  const commit = () => {
    if (draft === null) return;
    const text = draft.trim();
    if (text === '') {
      if (clearable && value) setValue(null, 'clear', today);
      setDraft(null);
      report(VALID);
      return;
    }
    const resolved = resolve(text);
    if (resolved instanceof Date) {
      setValue(resolved, 'input', resolved);
      setDraft(null);
      report(VALID);
    }
  };

  const inert = disabled || readOnly || readOnlyProp;

  return (
    <Input
      className={cx(styles.input, className)}
      data-slot='calendar-preview-input'
      data-scale={scale}
      placeholder={placeholder}
      trailingIcon={trailingIcon}
      disabled={disabled}
      readOnly={readOnly || readOnlyProp}
      aria-invalid={lastReported.current.valid ? undefined : true}
      value={draft ?? (value ? formatValue(value, scale) : '')}
      onValueChange={text => {
        if (inert) return;
        setDraft(text);
        if (text.trim() === '') {
          report(VALID);
          return;
        }
        const resolved = resolve(text);
        report(resolved instanceof Date ? VALID : resolved);
      }}
      onKeyDown={event => {
        onKeyDown?.(event);
        if (event.key === 'Enter') {
          event.preventDefault();
          commit();
        }
      }}
      onBlur={event => {
        onBlur?.(event);
        commit();
      }}
      {...props}
    />
  );
}

CalendarPreviewInput.displayName = 'CalendarPreview.Input';
