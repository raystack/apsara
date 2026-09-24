import { cx } from 'class-variance-authority';
import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { CalendarIcon } from '~/icons';
import { Input } from '../input';
import styles from './calendar-preview.module.css';
import type { CalendarPreviewField } from './calendar-preview-context';
import { useCalendarPreviewContext } from './calendar-preview-context';
import {
  defaultFormatValue,
  isRange as isRangeValue,
  isScaleValue
} from './calendar-preview-root';
import { useTriggerInput } from './calendar-preview-trigger';
import { anyDayBetween, dayKey, parseKey } from './date-adapter';
import { parseScaleInput } from './lib/parse';
import type { Scale } from './lib/scale';

export type CalendarPreviewInputInvalidReason =
  | 'unparseable'
  | 'out-of-bounds'
  | 'unavailable'
  | 'out-of-order';

export type CalendarPreviewInputValidity = {
  valid: boolean;
  reason?: CalendarPreviewInputInvalidReason;
  message?: string;
};

export interface CalendarPreviewInputProps
  extends Omit<ComponentProps<typeof Input>, 'value' | 'defaultValue'> {
  onValidityChange?: (validity: CalendarPreviewInputValidity) => void;
  field?: CalendarPreviewField;
  /** @defaultValue `'Invalid input'`, except out-of-order, which words itself */
  errorMessages?: Partial<Record<CalendarPreviewInputInvalidReason, string>>;
}

const DEFAULT_INVALID_MESSAGE = 'Invalid input';

const DEFAULT_OUT_OF_ORDER: Record<CalendarPreviewField, string> = {
  start: 'Start date cannot be after the end date',
  end: 'End date cannot be before the start date'
};

const VALID: CalendarPreviewInputValidity = { valid: true };

export function CalendarPreviewInput({
  field = 'start',
  placeholder,
  trailingIcon = <CalendarIcon />,
  onValidityChange,
  errorMessages,
  onKeyDown,
  onBlur,
  onFocus,
  onValueChange: onValueChangeProp,
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
    trailingValue,
    selectPeriod,
    isPeriodAvailable,
    selection,
    commitDay,
    setEndpoint,
    clearEndpoint,
    draft,
    activeField,
    open,
    setActiveField,
    setFieldReadOnly
  } = useCalendarPreviewContext('CalendarPreview.Input');

  const isRange = selection === 'range';

  const trigger = useTriggerInput();
  useEffect(() => {
    trigger?.registerInput(true);
    return () => trigger?.registerInput(false);
  }, [trigger]);

  useEffect(() => {
    if (!isRange) return;
    setFieldReadOnly(field, Boolean(readOnlyProp));
    return () => setFieldReadOnly(field, false);
  }, [isRange, field, readOnlyProp, setFieldReadOnly]);

  const [text, setText] = useState<string | null>(null);
  const [validity, setValidity] = useState<CalendarPreviewInputValidity>(VALID);

  const committed = useRef(value);

  /* The partner endpoint and the bounds both move while retained text sits there. */
  const judgedAgainst = useRef<unknown[]>([]);
  useEffect(() => {
    const partner = isRange
      ? field === 'start'
        ? draft?.to
        : draft?.from
      : undefined;
    const next = [
      partner && dayKey(partner, timeZone),
      minDate && dayKey(minDate, timeZone),
      maxDate && dayKey(maxDate, timeZone),
      isDateUnavailable
    ];
    const moved = next.some(
      (item, index) => item !== judgedAgainst.current[index]
    );
    judgedAgainst.current = next;
    if (!moved || text === null || committed.current !== value) return;
    const trimmed = text.trim();
    if (trimmed === '') return;
    const resolved = resolve(trimmed);
    report('valid' in resolved ? resolved : VALID);
  });

  useEffect(() => {
    if (committed.current === value) return;
    committed.current = value;
    setText(null);
    if (validity.valid) return;
    setValidity(VALID);
    onValidityChange?.(VALID);
  }, [value, validity.valid, onValidityChange]);

  const withMessage = (
    validity: CalendarPreviewInputValidity
  ): CalendarPreviewInputValidity =>
    validity.valid
      ? validity
      : {
          ...validity,
          message:
            (validity.reason && errorMessages?.[validity.reason]) ??
            (validity.reason === 'out-of-order'
              ? DEFAULT_OUT_OF_ORDER[field]
              : DEFAULT_INVALID_MESSAGE)
        };

  const report = (candidate: CalendarPreviewInputValidity) => {
    const next = withMessage(candidate);
    if (
      next.valid === validity.valid &&
      next.reason === validity.reason &&
      next.message === validity.message
    ) {
      return;
    }
    setValidity(next);
    onValidityChange?.(next);
  };

  const resolve = (
    text: string
  ): CalendarPreviewInputValidity | { date: Date; scale: Scale } => {
    const parsed = parseScaleInput(text, {
      referenceDate: today,
      trailing: trailingValue
    });
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
    const partner = field === 'start' ? draft?.to : draft?.from;
    if (isRange && partner) {
      const typed = dayKey(date, timeZone);
      const against = dayKey(partner, timeZone);
      if (field === 'start' ? typed > against : typed < against) {
        return { valid: false, reason: 'out-of-order' };
      }
      const [lead, trail] =
        typed < against ? [typed, against] : [against, typed];
      if (anyDayBetween(lead, trail, isDateUnavailable)) {
        return { valid: false, reason: 'unavailable' };
      }
    }
    return { date, scale: 'day' };
  };

  const commit = () => {
    if (text === null) return;
    const trimmed = text.trim();
    if (trimmed === '') {
      if (clearable) {
        if (isRange) clearEndpoint(field);
        else if (value) setValue(null, 'clear', today);
      }
      setText(null);
      report(VALID);
      return;
    }
    const resolved = resolve(trimmed);
    if ('valid' in resolved) return;
    if (isRange) setEndpoint(field, resolved.date);
    else if (resolved.scale !== 'day')
      selectPeriod(resolved.date, resolved.scale);
    else commitDay(resolved.date, 'input');
    setText(null);
    report(VALID);
  };

  const inert = disabled || readOnly || readOnlyProp;

  const endpoint = isRange
    ? ((field === 'start' ? draft?.from : draft?.to) ?? null)
    : (scaleDraft ?? (isRangeValue(value) ? null : value));
  const committedText = endpoint
    ? formatValue(endpoint, isScaleValue(endpoint) ? endpoint.scale : scale)
    : '';
  /* From the scales this root offers and the default formats, not `formatValue`:
     the parser reads only those, whatever the consumer displays. */
  const carriesScale = scales.length > 1 || scales[0] !== 'day';
  const resolvedPlaceholder =
    placeholder ??
    (carriesScale
      ? `Try: ${scales
          .slice(0, 3)
          .map(one => defaultFormatValue(today, one, timeZone))
          .join(', ')}`
      : isRange
        ? field === 'start'
          ? 'Select start date'
          : 'Select end date'
        : 'Select date');

  return (
    <Input
      className={cx(styles.input, className)}
      data-slot='calendar-preview-input'
      placeholder={resolvedPlaceholder}
      data-field={isRange ? field : undefined}
      /* `Input` paints `data-active` as focus, so a shut popover must not mark an endpoint. */
      data-active={
        isRange && activeField === field && (open || trigger === null)
          ? 'true'
          : undefined
      }
      onFocus={event => {
        onFocus?.(event);
        if (isRange) setActiveField(field);
      }}
      trailingIcon={trailingIcon}
      disabled={disabled}
      readOnly={readOnly || readOnlyProp}
      /* Spread, not set: an explicit `undefined` would erase Field's own invalid state. */
      {...(validity.valid
        ? {}
        : { 'aria-invalid': true, 'data-invalid': true })}
      value={text ?? committedText}
      onValueChange={(text, details) => {
        onValueChangeProp?.(text, details);
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
