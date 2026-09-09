import { cx } from 'class-variance-authority';
import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { CalendarIcon } from '~/icons';
import { Input } from '../input';
import styles from './calendar-preview.module.css';
import type { CalendarPreviewField } from './calendar-preview-context';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { dayKey, parseKey } from './date-adapter';
import { parseScaleInput } from './lib/parse';

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
   field's bounds, only of which endpoint was typed. */
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
    setEndpoint,
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
      next.valid === lastReported.current.valid &&
      next.reason === lastReported.current.reason &&
      next.message === lastReported.current.message
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
    /* An endpoint also has to sit on the right side of its partner, which the
       checks above cannot see — they read one date on its own. A grid click
       restarts the range instead, on purpose: a click is the next endpoint,
       but typing names the field it lands in. Equal days are a valid range. */
    const partner = field === 'start' ? draft?.to : draft?.from;
    if (isRange && partner) {
      const typed = dayKey(date, timeZone);
      const against = dayKey(partner, timeZone);
      if (field === 'start' ? typed > against : typed < against) {
        return { valid: false, reason: 'out-of-order' };
      }
    }
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
    /* Addressed to this field, not to "the next endpoint" — a click means the
       latter, but typing into the end of a settled range means the former. */
    if (isRange) setEndpoint(field, resolved);
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
      /* Input paints its error border from `data-invalid`, so marking only
         `aria-invalid` reached assistive tech and left the field looking
         untouched. Spread rather than set to `undefined`: these props land
         after Field's, and an explicit `undefined` erases the invalid state
         Field sets for errors this input knows nothing about. */
      {...(lastReported.current.valid
        ? {}
        : { 'aria-invalid': true, 'data-invalid': true })}
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
