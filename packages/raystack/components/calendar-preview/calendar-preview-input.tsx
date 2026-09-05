import { cx } from 'class-variance-authority';
import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { CalendarIcon } from '~/icons';
import { Input } from '../input';
import styles from './calendar-preview.module.css';
import type { CalendarPreviewField } from './calendar-preview-context';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { dayKey, parseKey } from './date-adapter';
import { parseScaleInput } from './lib/parse';
import type { Scale } from './lib/scale';

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
    scales,
    scaleDraft,
    selectPeriod,
    isPeriodAvailable,
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

  /* Only the scales this root offers: typing "Q4" into a day-only field is not
     a quarter, it is a typo. */
  const resolve = (
    text: string
  ): CalendarPreviewInputValidity | { date: Date; scale: Scale } => {
    const parsed = parseScaleInput(text);
    if (!parsed || !scales.includes(parsed.scale)) {
      return { valid: false, reason: 'unparseable' };
    }
    const date = parseKey(parsed.date);

    if (parsed.scale !== 'day') {
      return isPeriodAvailable(date, parsed.scale)
        ? { date, scale: parsed.scale }
        : { valid: false, reason: 'out-of-bounds' };
    }

    const key = dayKey(date, timeZone);
    if (
      (minDate && key < dayKey(minDate, timeZone)) ||
      (maxDate && key > dayKey(maxDate, timeZone))
    ) {
      return { valid: false, reason: 'out-of-bounds' };
    }
    if (isDateUnavailable(date)) return { valid: false, reason: 'unavailable' };
    return { date, scale: 'day' };
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
    if ('valid' in resolved) return;
    /* A typed endpoint goes through the same machine a clicked one does, so
       the two cannot disagree about what completes a range. */
    if (isRange) selectDay(resolved.date);
    else if (resolved.scale !== 'day')
      selectPeriod(resolved.date, resolved.scale);
    else setValue(resolved.date, 'input', resolved.date);
    setText(null);
    report(VALID);
  };

  const inert = disabled || readOnly || readOnlyProp;

  const endpoint = isRange
    ? ((field === 'start' ? draft?.from : draft?.to) ?? null)
    : (scaleDraft ?? (value as Date | null));
  const committedText = endpoint ? formatValue(endpoint, scale) : '';
  /* A multi-scale field has to advertise what it accepts; a day-only one does
     not, and the old placeholder still reads correctly there. */
  const resolvedPlaceholder =
    placeholder ??
    (scales.length > 1
      ? 'Try: May 2027, Q4, 20/05/2027'
      : isRange
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
        report('valid' in resolved ? resolved : VALID);
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
