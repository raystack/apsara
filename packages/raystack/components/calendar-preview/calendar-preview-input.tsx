import { cx } from 'class-variance-authority';
import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { CalendarIcon } from '~/icons';
import { Input } from '../input';
import styles from './calendar-preview.module.css';
import type { CalendarPreviewField } from './calendar-preview-context';
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
  /**
   * Which endpoint this field addresses, at `selection='range'`. Two inputs,
   * each addressable — rather than one bag of props per endpoint.
   */
  field?: CalendarPreviewField;
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
  field = 'start',
  placeholder,
  trailingIcon = <CalendarIcon />,
  onValidityChange,
  onKeyDown,
  onBlur,
  onFocus,
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
    readOnly,
    selection,
    selectDay,
    draft,
    activeField,
    setActiveField,
    setFieldReadOnly
  } = useCalendarPreviewContext('CalendarPreview.Input');

  const isRange = selection === 'range';

  /* The grid has to know which endpoint refuses a write, and `readOnly` is
     this input's prop, so it registers rather than the root guessing. */
  useEffect(() => {
    if (!isRange) return;
    setFieldReadOnly(field, Boolean(readOnlyProp));
    return () => setFieldReadOnly(field, false);
  }, [isRange, field, readOnlyProp, setFieldReadOnly]);

  /* Null means "show the committed value"; a string is the user's draft. */
  const [text, setText] = useState<string | null>(null);
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
    if (text === null) return;
    const trimmed = text.trim();
    if (trimmed === '') {
      if (clearable && value) setValue(null, 'clear', today);
      setText(null);
      report(VALID);
      return;
    }
    const resolved = resolve(trimmed);
    if (!(resolved instanceof Date)) return;
    /* A typed endpoint goes through the same machine a clicked one does, so
       the two cannot disagree about what completes a range. */
    if (isRange) selectDay(resolved);
    else setValue(resolved, 'input', resolved);
    setText(null);
    report(VALID);
  };

  const inert = disabled || readOnly || readOnlyProp;

  const endpoint = isRange
    ? ((field === 'start' ? draft?.from : draft?.to) ?? null)
    : (value as Date | null);
  const committedText = endpoint ? formatValue(endpoint, scale) : '';
  const resolvedPlaceholder =
    placeholder ??
    (isRange
      ? field === 'start'
        ? 'Select start date'
        : 'Select end date'
      : 'Select date');

  return (
    <Input
      className={cx(styles.input, className)}
      data-slot='calendar-preview-input'
      data-scale={scale}
      placeholder={resolvedPlaceholder}
      data-field={isRange ? field : undefined}
      data-active={isRange && activeField === field ? 'true' : undefined}
      onFocus={event => {
        onFocus?.(event);
        if (isRange) setActiveField(field);
      }}
      trailingIcon={trailingIcon}
      disabled={disabled}
      readOnly={readOnly || readOnlyProp}
      aria-invalid={lastReported.current.valid ? undefined : true}
      value={text ?? committedText}
      onValueChange={text => {
        if (inert) return;
        setText(text);
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
