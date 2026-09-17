import { cx } from 'class-variance-authority';
import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { CalendarIcon } from '~/icons';
import { Input } from '../input';
import styles from './calendar-preview.module.css';
import type { CalendarPreviewField } from './calendar-preview-context';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { isRange as isRangeValue, isScaleValue } from './calendar-preview-root';
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
  /**
   * The message to show, already resolved against `errorMessages`. Absent
   * while valid, so it can be handed straight to `Field`'s `error`.
   */
  message?: string;
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
  /**
   * Replaces the message for one or more reasons; anything left out keeps the
   * default. That default is one flat string because only the consumer knows
   * the field's bounds — a built-in message cannot say which dates would be
   * accepted.
   *
   * @defaultValue `'Invalid input'` for every reason
   */
  errorMessages?: Partial<Record<CalendarPreviewInputInvalidReason, string>>;
}

const DEFAULT_INVALID_MESSAGE = 'Invalid input';

/* The one reason the component can word itself: it needs no knowledge of the
   field's bounds. */
const DEFAULT_OUT_OF_ORDER: Record<CalendarPreviewField, string> = {
  start: 'Start date cannot be after the end date',
  end: 'End date cannot be before the start date'
};

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
    setActiveField,
    setFieldReadOnly
  } = useCalendarPreviewContext('CalendarPreview.Input');

  const isRange = selection === 'range';

  const trigger = useTriggerInput();
  useEffect(() => {
    trigger?.registerInput(true);
    return () => trigger?.registerInput(false);
  }, [trigger]);

  /* The grid has to know which endpoint refuses a write, and `readOnly` is
     this input's prop, so it registers rather than the root guessing. */
  useEffect(() => {
    if (!isRange) return;
    setFieldReadOnly(field, Boolean(readOnlyProp));
    return () => setFieldReadOnly(field, false);
  }, [isRange, field, readOnlyProp, setFieldReadOnly]);

  /* Null means "show the committed value"; a string is the user's draft. */
  const [text, setText] = useState<string | null>(null);
  const [validity, setValidity] = useState<CalendarPreviewInputValidity>(VALID);

  const committed = useRef(value);

  /* Retained text is judged against things outside it — the partner endpoint
     and the bounds — and both move while it sits there. Without this, an end
     rejected for crossing a 10 Apr start stayed marked invalid after the start
     moved to the 1st, and a draft kept its verdict when `minDate` changed
     under it. Runs every render and compares rather than listing deps:
     `resolve` closes over the whole context and is rebuilt each time. */
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
    /* A value change replaces the text outright, which the effect below owns. */
    if (!moved || text === null || committed.current !== value) return;
    const trimmed = text.trim();
    if (trimmed === '') return;
    const resolved = resolve(trimmed);
    report('valid' in resolved ? resolved : VALID);
  });

  /* A value this field did not type replaces whatever it was drafting, or a
     rejected draft outlives the day the user went on to click. */
  useEffect(() => {
    if (committed.current === value) return;
    committed.current = value;
    setText(null);
    if (validity.valid) return;
    setValidity(VALID);
    onValidityChange?.(VALID);
  }, [value, validity.valid, onValidityChange]);

  /* Derived from the reason rather than returned alongside it, so the reason
     stays the single source of truth. */
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
    /* The root's clock and its edge, so what the parser reports is what the
       commit writes — reading them off the wall clock is how `Q4` landed in
       the wrong year. */
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
    /* The checks above read one date on its own and cannot see the partner. A
       grid click restarts instead of rejecting, on purpose. Equal days are a
       valid range. */
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
    /* A typed endpoint writes the field it was typed into; only a click means
       "the next endpoint". */
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
  /* A period reads back at its own scale, as `.Trigger` does: the view can sit
     on days while the committed value is a quarter. */
  const committedText = endpoint
    ? formatValue(endpoint, isScaleValue(endpoint) ? endpoint.scale : scale)
    : '';
  const resolvedPlaceholder =
    placeholder ??
    (scales.length > 1
      ? 'Try: 15 Aug 2026, May 2027, Q4'
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
      data-active={isRange && activeField === field ? 'true' : undefined}
      onFocus={event => {
        onFocus?.(event);
        if (isRange) setActiveField(field);
      }}
      trailingIcon={trailingIcon}
      disabled={disabled}
      readOnly={readOnly || readOnlyProp}
      /* Input paints its error border from `data-invalid`, so marking only
         `aria-invalid` reached assistive tech and left the field looking
         untouched. Spread rather than set to `undefined`: these props land
         after Field's, and an explicit `undefined` erases the invalid state
         Field sets for errors this input knows nothing about. */
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
