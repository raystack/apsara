'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useEffect, useRef, useState } from 'react';
import { PropsBase } from 'react-day-picker';
import { Input } from '../input';
import { InputProps } from '../input/input';
import { Popover } from '../popover';
import { PopoverContentProps } from '../popover/popover';
import { Calendar, type CalendarPropsExtended } from './calendar';
import styles from './calendar.module.css';
import { usePickerPopover } from './use-picker-popover';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/*
 * Picker-specific calendar surface. `mode` is owned by the picker; the other
 * forced keys (`selected`/`onSelect`/`required`) aren't in `PropsBase` so
 * they're already unreachable.
 */
type DatePickerCalendarSlot = Omit<PropsBase, 'mode'> & CalendarPropsExtended;

export interface DatePickerSlotProps {
  input?: InputProps;
  calendar?: DatePickerCalendarSlot;
  popover?: PopoverContentProps;
}

export interface DatePickerProps {
  dateFormat?: string;
  /**
   * Props for each picker slot. When both this and the legacy
   * `inputProps`/`calendarProps`/`popoverProps` are set, `slotProps` wins.
   */
  slotProps?: DatePickerSlotProps;
  /** @deprecated Use `slotProps.input` instead. */
  inputProps?: InputProps;
  /** @deprecated Use `slotProps.calendar` instead. */
  calendarProps?: DatePickerCalendarSlot;
  /** @deprecated Use `slotProps.popover` instead. */
  popoverProps?: PopoverContentProps;
  onSelect?: (date: Date) => void;
  value?: Date;
  defaultValue?: Date;
  children?:
    | React.ReactNode
    | ((props: { selectedDate: string }) => React.ReactNode);
  showCalendarIcon?: boolean;
  timeZone?: string;
}

export function DatePicker({
  dateFormat = 'DD MMM YYYY',
  slotProps,
  inputProps: legacyInputProps,
  calendarProps: legacyCalendarProps,
  popoverProps: legacyPopoverProps,
  value: valueProp,
  defaultValue,
  onSelect = () => undefined,
  children,
  showCalendarIcon = true,
  timeZone
}: DatePickerProps) {
  // Merge legacy props with slotProps; slotProps wins when both are set.
  const inputProps = { ...legacyInputProps, ...slotProps?.input };
  const calendarProps = { ...legacyCalendarProps, ...slotProps?.calendar };
  const popoverProps = { ...legacyPopoverProps, ...slotProps?.popover };
  /*
   * Gate the popover when the input is disabled — the trailing icon
   * renders as a sibling `<div>` to the `<input>`, so its clicks bubble
   * to `Popover.Trigger` even when the input itself is `disabled`.
   */
  const isDisabled = !!inputProps.disabled;
  /*
   * Initial value: controlled prop > defaultValue (uncontrolled init) >
   * undefined. With both omitted the picker starts unselected so the
   * "Select date" placeholder is honest.
   */
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    valueProp ?? defaultValue
  );
  const [error, setError] = useState<string>();

  // Sync only when controlled — uncontrolled mode keeps its own state.
  // biome-ignore lint/correctness/useExhaustiveDependencies: compare on timestamp, not Date identity
  useEffect(() => {
    if (valueProp !== undefined) setSelectedDate(valueProp);
  }, [valueProp?.getTime()]);

  const formattedDate = selectedDate
    ? dayjs(selectedDate).format(dateFormat)
    : '';

  const [inputValue, setInputValue] = useState(formattedDate);

  /*
   * Separate from `selectedDate` so chevron/dropdown nav doesn't rewrite the
   * committed date — only day-clicks (`onSelect`) do. Initial month honors
   * `calendarProps.defaultMonth`, then the selected date, then today.
   */
  const [viewMonth, setViewMonth] = useState<Date>(
    calendarProps?.defaultMonth ?? selectedDate ?? new Date()
  );

  // Mirror for reading inside the outside-click callback closure.
  const selectedDateRef = useRef(selectedDate);

  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  // Sync the input when the committed date changes from a non-typing source.
  useEffect(() => {
    setInputValue(formattedDate);
  }, [formattedDate]);

  // Hook owns open/close, outside-click, and the year/month dropdown carve-out.
  const popover = usePickerPopover({
    onOutsideClick: () => closePicker()
  });

  /*
   * Reset the visible month on open or external selection change. Honor
   * `calendarProps.defaultMonth` so consumers controlling the initial view
   * see it every time the picker opens, not only on first mount.
   */
  useEffect(() => {
    if (popover.isOpen) {
      setViewMonth(calendarProps?.defaultMonth ?? selectedDate ?? new Date());
    }
  }, [popover.isOpen, selectedDate, calendarProps?.defaultMonth]);

  function closePicker() {
    popover.disengage();
    const committedDate = selectedDateRef.current;
    setInputValue(committedDate ? dayjs(committedDate).format(dateFormat) : '');
    setError(undefined);
    /*
     * Emit the committed Date directly. Going through
     * `dayjs(formattedString).toDate()` re-parses the formatted string without
     * a format spec, which falls back to native `Date` parsing and can shift
     * non-ISO formats (e.g. DD/MM/YYYY → wrong Date).
     *
     * Skip when nothing was ever selected — `onSelect` is typed
     * `(date: Date) => void` so we don't fire with `undefined`.
     */
    if (!error && committedDate) onSelect(committedDate);
  }

  function handleSelect(day: Date | undefined) {
    setSelectedDate(day);
    // RDP can hand us `undefined` when `required={false}` and the user
    // clicks the currently-selected day (deselect). Only forward defined
    // dates to consumer `onSelect` — keeps the prop type narrow.
    if (day) onSelect(day);
    setError(undefined);
    popover.disengage();
  }

  function handleKeyUp(event: React.KeyboardEvent) {
    if (event.code === 'Enter' && popover.inputRef.current) {
      popover.inputRef.current.blur();
      closePicker();
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setInputValue(value);

    const date = dayjs(value, dateFormat, true);

    const isValidDate = date.isValid();

    /*
     * RDP treats `startMonth`/`endMonth` as months — compare against month
     * bounds so any day inside the boundary month is accepted.
     */
    const isAfter =
      calendarProps?.startMonth !== undefined
        ? date.isSameOrAfter(dayjs(calendarProps.startMonth).startOf('month'))
        : true;
    const isBefore =
      calendarProps?.endMonth !== undefined
        ? date.isSameOrBefore(dayjs(calendarProps.endMonth).endOf('month'))
        : true;

    /*
     * No upper-bound on "future": the grid lets users click future days, so
     * typing and clicking should agree.
     */
    const isValid = isValidDate && isAfter && isBefore;

    if (isValid) {
      setSelectedDate(date.toDate());
      setError(undefined);
    } else {
      setError('Invalid date');
    }
  }

  const defaultTrigger = (
    <Input
      size='small'
      placeholder='Select date'
      aria-invalid={!!error}
      className={styles.datePickerInput}
      trailingIcon={showCalendarIcon ? <CalendarIcon /> : undefined}
      {...inputProps}
      ref={popover.inputRef}
      value={inputValue}
      onChange={handleInputChange}
      onFocus={popover.handleInputFocus}
      onBlur={popover.handleInputBlur}
      onKeyUp={handleKeyUp}
    />
  );

  /*
   * Always wrap the trigger in a `<div>` so the rendered outer element is
   * never a `<button>`. This keeps `nativeButton={false}` correct regardless
   * of what the consumer passes (string, host element, React component that
   * happens to render a button, etc.) — avoiding Base UI's button-nesting
   * warning.
   */
  const triggerContent =
    typeof children === 'function'
      ? children({ selectedDate: formattedDate })
      : children || defaultTrigger;

  return (
    <Popover
      open={isDisabled ? false : popover.isOpen}
      onOpenChange={(open, eventDetails) => {
        if (isDisabled) return;
        popover.onOpenChange(open, eventDetails?.reason);
      }}
    >
      <Popover.Trigger
        nativeButton={false}
        render={<div>{triggerContent}</div>}
      />
      <Popover.Content
        ref={popover.contentRef}
        {...popoverProps}
        className={cx(styles.calendarPopover, popoverProps?.className)}
        side={popoverProps?.side ?? 'top'}
      >
        <Calendar
          {...calendarProps}
          required={false}
          timeZone={timeZone}
          onDropdownOpen={popover.markDropdownOpen}
          mode='single'
          selected={selectedDate}
          month={viewMonth}
          onSelect={handleSelect}
          onMonthChange={setViewMonth}
        />
      </Popover.Content>
    </Popover>
  );
}

DatePicker.displayName = 'DatePicker';
